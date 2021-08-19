import faiss
import numpy as np
from projection import get_projections


class FaissIndex:
    def __init__(self):
        self.has_index = False
        self.index_type = None
        self.index_params = None
        self.index = None

        self.has_data = False
        self.names = None
        self.vectors = None

    def set_data(self, data):
        if len(data) == 0:
            return
        self.has_data = True
        self.names = [d[0] for d in data]
        self.vectors = [d[1] for d in data]
        self.d = len(self.vectors[0])

        if self.has_index:
            self.generate_index()

    def set_index(self, type, params):
        self.has_index = True
        self.index_type = type
        self.index_params = params

        if self.has_data:
            self.generate_index()

    def generate_index(self):
        if self.has_index and self.has_data:
            if self.index_type == 'ivf_flat':
                nlist = self.index_params.get('nlist', 32)
                index = faiss.index_factory(self.d, 'IVF%s,Flat' % nlist)
                self.index = index
                self.k = 8
                self.index.train(self.vectors)
                self.index.add(self.vectors)

                self.init_ivf()

                self.has_index = True
            elif self.index_type == 'hnsw':
                pass

    def init_ivf(self):
        index = self.index
        self.centroids = index.quantizer.reconstruct_n(0, index.nlist)
        invlists = index.invlists
        list_id2vector_ids = [
            faiss.rev_swig_ptr(
                invlists.get_ids(list_id),
                invlists.list_size(list_id)
            ).tolist()
            for list_id in range(index.nlist)
        ]
        self.list_id2vector_ids = list_id2vector_ids

        vector_id2list_id = {}
        max_nlist_size = 0
        for list_id in range(index.nlist):
            max_nlist_size = max(
                max_nlist_size,
                len(list_id2vector_ids[list_id])
            )
            for vector_id in list_id2vector_ids[list_id]:
                vector_id2list_id[vector_id] = list_id
        self.vector_id2list_id = vector_id2list_id
        self.max_nlist_size = max_nlist_size

    def set_index_search_params(self, params):
        if self.has_index:
            if self.index_type == 'ivf_flat':
                nprobe = params.get('nprobe', 4)
                self.index.nprobe = nprobe
                k = params.get('k', 8)
                self.k = k
            elif self.index_type == 'hnsw':
                pass

    def search_by_name(self, name):
        target_id = self.names.index(name)
        return self.search_by_id(target_id)

    def search_by_id(self, target_id):
        index = self.index

        target = np.array([self.vectors[target_id]], dtype='float32')
        _, _fine_ids = self.index.search(target, self.k)
        fine_ids = _fine_ids[0]

        top_kk = min(self.max_nlist_size * index.nprobe, index.nlist)
        _, _top_kk_ids = index.search(target, top_kk)
        top_kk_ids = _top_kk_ids[0]
        list_ids = list({self.vector_id2list_id[id] for id in top_kk_ids if id >= 0})
        coarse_centroids = [self.centroids[list_id] for list_id in list_ids]
        coarse_ids = []
        for list_id in list_ids:
            coarse_ids += self.list_id2vector_ids[list_id]
        coarse_vectors = [self.vectors[id] for id in coarse_ids]

        fit_vectors = coarse_vectors + coarse_centroids
        projections = get_projections(fit_vectors).tolist()

        def get_type(id):
            if id == target_id:
                return 'target'
            if id in fine_ids:
                return 'fine'
            return 'coarse'

        format_res_vectors = [
            {
                'id': coarse_ids[i],
                'projection': projections[i],
                'type': get_type(coarse_ids[i]),
                'list_id': get_nearest_centriod_and_list_id(fit_vectors[i], self.centroids)
            }
            for i in range(len(fit_vectors))
        ]
        format_res_centroids = [
            {
                'id': 'centroid-%d' % get_nearest_centriod_and_list_id(fit_vectors[i]),
                'projection': projections[i],
                'type': 'centroid',
                'list_id': list_ids[i - len(coarse_vectors)]
            }
            for i in range(len(coarse_vectors), len(coarse_vectors) + len(coarse_centroids))
        ]

        return format_res_vectors + format_res_centroids


def distance(vector_0, vector_1):
    return np.linalg.norm(vector_0 - vector_1)

def get_nearest_centriod_and_list_id(vector, centroids):
    list_id = 0
    min_dis = 999999999
    for i in range(len(centroids)):
        centroid = centroids[i]
        dis = distance(vector, centroid)
        if dis < min_dis:
            min_dis = dis
            list_id = i
    return list_id

faissIndex = FaissIndex()
