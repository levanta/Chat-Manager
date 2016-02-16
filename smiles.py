import os 
import tornado.web

class SmilesHandler(tornado.web.RequestHandler):
    def get(self):
		directory = os.path.join(os.path.dirname(__file__), "static/smiles")
		files = os.listdir(directory)
		smiles = []
		ar = []
		iteration = 0
		for i in files:
			smiles.append(i)
			ar.append(':smile' + str(iteration) + ':')
			iteration = iteration+1
		smiles.sort()
		smiles.sort(key=len)

		self.render("smiles.html", smile=smiles, ar=ar)