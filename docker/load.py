from backgroundremover.bg import remove;

# This file is called from Docker to load the models used in the backgroundremover.bg module. It reads the image file and sends it to the r
file = open('load.png', 'rb');
data = file.read();
file.close();

remove(data)