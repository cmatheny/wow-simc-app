import json
import logger
import tornado.web
from handlers import RequestMapping

@RequestMapping(url = r"/")
class MainHandler:
    def get(self):
        logger.log("Hello, world")
        self.write("HI")

@RequestMapping(url = r"/simulate")
class SimulationHandler:
    def get(self):
        message = "Do a simulation"
        logger.log(message)
        self.write({"Message": message})


'''        
mappings.append(r"/simulate", SimulateHandler)
class SimulateHandler(tornado.web.RequestHandler):
    def post(self):
            request_json = flask.request.get_json(force=True)
        print(request_json, file=sys.stderr)
        results_json = service.simc_armory_to_json(request_json)
        return return_json(results_json)
        
def stringify(json_dict):
    return json.dumps(json_dict, sort_keys=True, indent=2)

@app.route('/queue', methods=['GET'])
def get_queue():
    queue = service.get_queue()
    print(queue, file=sys.stderr)
    return flask.jsonify(queue)

@app.route('/test', methods=['GET'])
def test_endpoint():
    print("Got request")

@app.route('/test', methods=['POST'])
def test_endpoint_post():
    request_json = flask.request.get_json(force=True)
    print(request_json, file=sys.stderr)
    results_json = service.simc_armory_to_json(request_json)
    return flask.jsonify(results_json)
'''