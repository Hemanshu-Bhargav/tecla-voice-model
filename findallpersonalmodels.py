import os
import fnmatch

listofpmdl = []

with os.scandir('home/pi/snowboy/examples/Python3/') as allfiles:
    for pmdlfiles in allfiles:
        if fnmatch.fnmatch(pmdlfiles, '*.pmdl'):
            listofpmdl.append(os.path.join(pmdlfiles))
