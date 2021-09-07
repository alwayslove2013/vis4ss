import numpy as np
import umap.umap_ as umap
from sklearn.manifold import MDS
umap_fit = umap.UMAP(
    n_neighbors=10,
)

def get_projections(vectors):
    u = umap_fit.fit_transform(vectors)
    return u

def get_umap_projections(vectors):
    u = umap_fit.fit_transform(vectors)
    return u


mds = MDS(n_components=2)

def get_mds_projections(vectors):
    m = mds.fit_transform(vectors)
    return m