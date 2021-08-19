import numpy as np
import umap.umap_ as umap
umap_fit = umap.UMAP(
    n_neighbors=10,
)

def get_projections(vectors):
    u = umap_fit.fit_transform(vectors)
    return u