import json
import sys
import ast

def func():
    incoming_data = sys.argv[1]
    test_data = ast.literal_eval(incoming_data)
    print(test_data[0]['x'])


func()