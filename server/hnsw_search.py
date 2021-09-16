import faiss
import numpy as np
from heapq import heappop, heappush
from projection import get_projections
from collections import defaultdict
from enum import Enum


def search_vis_hnsw(hnsw, data, names, target, target_id, k):
    global vectors, entry_point, max_level, cum_nneighbor_per_level, levels, offsets, neighbors
    vectors = data
    entry_point = hnsw.entry_point
    max_level = hnsw.max_level
    cum_nneighbor_per_level = faiss.vector_to_array(
        hnsw.cum_nneighbor_per_level)
    levels = faiss.vector_to_array(hnsw.levels)
    offsets = faiss.vector_to_array(hnsw.offsets)
    neighbors = faiss.vector_to_array(hnsw.neighbors)

    search_res, vis_res = search(target, k, hnsw.efSearch)

    format_res = {
        'num_level': max_level + 1,
        'data': []
    }

    for level in range(max_level, -1, -1):
        all_nodes_id = vis_res[level]['nodes']
        if len(all_nodes_id) <= 1:
            continue
        all_nodes = vectors[all_nodes_id].tolist()
        fit_vectors = all_nodes + target.tolist()
        projections = get_projections(fit_vectors)

        upper_level = vis_res[level]['eps']
        candidates = vis_res[level]['candidates']
        fines = vis_res[level]['fines']
        fine_node_ids = [i for i in range(
            len(all_nodes_id)) if all_nodes_id[i] in fines]
        fine_centroid_projection = projections[fine_node_ids].mean(0).tolist()
        projections = projections.tolist()
        level_res = {}

        def get_type(id):
            # if id == target_id:
            #     return 'target'
            if id in upper_level:
                return 'upper_level'
            if id in fines:
                return 'fine'
            if id in candidates:
                return 'candidate'
            return 'coarse'
        level_nodes = [
            {
                'auto_id': '%s' % all_nodes_id[i],
                'id': names[all_nodes_id[i]],
                'projection': projections[i],
                'type': get_type(all_nodes_id[i])
            }
            for i in range(len(all_nodes_id))
        ] + [
            {
                'auto_id': 'target',
                'id': 'target',
                'projection': projections[-1],
                'type': 'target'
            }
        ]

        level_links = vis_res[level]['links']
        level_res = {
            'level': max_level - level,
            'fine_centroid_projection': fine_centroid_projection,
            'have_cluster': 0,
            'nodes': level_nodes,
            'have_links': 1,
            'links': level_links,
        }
        format_res['data'].append(level_res)

    return format_res


Based = 1
Visited = 2
Extended = 3
JumpTo = 4
Fine = 5


def search_layer(target, eps, ef, level, k):
    visited = set()
    candidates = []
    waiting_list = []
    links = defaultdict(int)
    source = defaultdict(int)

    for ep in eps:
        visited.add(ep)
        c_dis = distance(target, vectors[ep])
        heappush(candidates, (c_dis, c_dis, ep))
        w_dis = distance(target, vectors[ep])
        heappush(waiting_list, (-w_dis, w_dis, ep))

    vis_candidates = []
    vis_candidates_link = []

    while len(candidates) > 0:
        c = heappop(candidates)
        vis_candidates.append(int(c[2]))
        f = waiting_list[0]
        if c[1] > f[1]:
            break
        c_neighbors = get_neighbors_with_levels(c[2])[level]
        for e in c_neighbors:
            links[(c[2], e)] = max(links[(c[2], e)], Visited)
            if e not in visited:
                visited.add(e)
                links[(c[2], e)] = max(links[(c[2], e)], Extended)
                f = waiting_list[0]
                e_dis = distance(target, vectors[e])
                if e_dis < f[1] or len(waiting_list) < ef:
                    links[(c[2], e)] = max(links[(c[2], e)], JumpTo)
                    source[e] = c[2]
                    heappush(candidates, (e_dis, e_dis, e))
                    heappush(waiting_list, (-e_dis, e_dis, e))
                    if len(waiting_list) > ef:
                        heappop(waiting_list)

                    # vis_candidates.append(e)
                    vis_candidates_link.append([int(c[2]), int(e)])

    waiting_list.sort(key=lambda x: x[1])
    if level == 0:
        waiting_list = waiting_list[:k]
    fine_res = [w[2] for w in waiting_list]
    for fine_id in fine_res:
        target_id = fine_id
        if target_id not in source:
            continue
        source_id = source[target_id]
        while source_id != target_id:
            links[(source_id, target_id)] = Fine
            target_id = source_id
            if target_id not in source:
                break
            source_id = source[target_id]
        
        links[(fine_id, 'target')] = Fine
    
    for node_id in visited:
        neighbors = get_neighbors_with_levels(node_id)[level]
        for n in neighbors:
            if n in visited:
                links[(node_id, n)] = max(links[(node_id, n)], Based)
    
    links_format_res = [[path[0], path[1], links[path]] for path in links]

    vis_data = {
        'nodes': list(visited),
        'eps': eps[:],
        'candidates': vis_candidates,
        'links': links_format_res
    }

    return fine_res, vis_data


def search(target, k, ef):
    eps = [entry_point]
    vis_res = {}
    for i in range(max_level + 1):
        level = max_level - i
        waiting_list, vis_data = search_layer(
            target, eps, ef if level == 0 else 1, level, k)
        eps = waiting_list
        vis_data['fines'] = waiting_list[:]
        vis_res[level] = vis_data

    search_res = waiting_list[:k]
    vis_res[0]['fines'] = waiting_list[:k]
    return search_res, vis_res


def get_neighbors_with_levels(id):
    level = levels[id]
    all_neighbors = [int(x) for x in neighbors[offsets[id]: offsets[id + 1]]]
    level_neighbors = {
        i: [
            node
            for node in all_neighbors[
                cum_nneighbor_per_level[i]:
                cum_nneighbor_per_level[i+1]
            ]
            if node >= 0
        ]
        for i in range(level)
    }
    return level_neighbors


def get_based_links(ids, level):
    based_links = []
    for id in ids:
        neighbors = get_neighbors_with_levels(id)[level]
        for n in neighbors:
            if n in ids:
                based_links.append([int(id), int(n)])
    return based_links


def get_all_neighbors(id):
    all_neighbors = neighbors[offsets[id]: offsets[id + 1]]
    return [n for n in all_neighbors if n >= 0]


def distance(vector_0, vector_1):
    return np.linalg.norm(vector_0 - vector_1)


def get_min_vector_id(v, v_ids):
    dis = [distance(v, vectors[v_id]) for v_id in v_ids]
    return v_ids[np.argmin(dis)]


def get_min_k_vector_id(v, v_ids, k):
    dis = [{
        'id': v_id,
        'dis': distance(v, vectors[v_id])
    } for v_id in v_ids]
    dis.sort(key=lambda x: x['dis'])
    return dis[:k]
