import torch
from torchvision import datasets, transforms, models
from PIL import Image
import numpy as np

transform_ops = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])

model = models.resnet18(pretrained=True)
encoder = torch.nn.Sequential(*(list(model.children())[:-1]))
encoder.eval()

def file_name2vector(files):
    image_vector = [transform_ops(Image.open(image_file)) for image_file in files]
    image_vector = torch.stack(image_vector, dim=0)
    
    with torch.no_grad():
        image_vector = encoder(image_vector).squeeze().numpy()
    return image_vector

data_dir = "/Users/mintian/minmin/data/VOC_2G"

class ImageFolderWithPaths(datasets.ImageFolder):
    def __getitem__(self, index):
        return super(ImageFolderWithPaths, self).__getitem__(index) + (self.imgs[index][0],)

dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_size = 256)

steps = len(dataloader)
step = 0
vectors = []
file_names = []
for inputs, labels, paths in dataloader:
    print("Insert Step: " + str(step) + "/" + str(steps))
    step += 1
    file_names += [path.rsplit("/",1)[1] for path in paths]
    with torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()
    vectors += output.tolist()

vectors = np.array(vectors, dtype="float32")
print('Finished:', vectors.shape)

def str_vector(v):
    return "[%s]" % ",".join([str(x) for x in v])

import csv
with open('/Users/mintian/minmin/data/VOC_2G_vectors.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    header = ['name', 'vector']
    writer.writerow(header)
    data = [[file_names[i], str_vector(vectors[i])] for i in range(len(vectors))]
#     data = [[i, vectors[i]] for i in range(len(vectors))]
    writer.writerows(data)