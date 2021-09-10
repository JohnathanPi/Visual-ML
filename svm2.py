import json
import sys
import ast
import numpy as np
from sklearn import svm


# data = "{'''1''': [{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}], '''-1''': [{'x': -5, 'y':-3}, {'x': -1, 'y': -4}, {'x': -2, 'y': -7}]}"
# data = "{'''1''': [{'x': 2, 'y':2}, {'x': 1, 'y': 1}], '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# data = "{'''1''': [{'x': 8, 'y':16}, {'x': 13, 'y': 16}], 
# '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# "{'1':[{'x':10,'y':16},{'x':15,'y':9},{'x':8,'y':8}],'-1':[{'x':5.017811704834607,'y':-10.264211369095273},{'x':4.0769013288097256,'y':-0.09607686148918759},{'x':-4.174158891716145,'y':-1.5372297838270619}]}"
data = sys.argv[1]
# SOLVE INFINITE SLOPE CASE BY CHECKING FOR SYMMETRICAL SUPPORT VECTORS
def solve_svm(data):
    data_obj = ast.literal_eval(data)
    X = []
    y = []
    for label in data_obj:
        for i in range(len(data_obj[label])):
            curr = data_obj[label][i]
            X.append([curr['x'], curr['y']])
            y.append(label)
    clf = svm.SVC(kernel = 'linear') 
    clf.fit(X, y)
    support_vectors = {}
    coeffs = clf.coef_.tolist()
    print(coeffs)
    intercept = clf.intercept_.tolist()
    def return_x1(w0, x0, b, w1):
        return np.around((-w0*x0 - b) / w1, 2)
    def return_x0(w0, x1, b, w1):
        return np.around((b - w1*x1) / w0, 2)

    x0_1 = return_x0(coeffs[0][0], 25, intercept[0], coeffs[0][1])
    x0_2 = return_x0(coeffs[0][0], -25, intercept[0], coeffs[0][1])
    x1_1 = return_x1(coeffs[0][0], 25, intercept[0], coeffs[0][1])
    x1_2 = return_x1(coeffs[0][0], -25, intercept[0], coeffs[0][1])
    support_vectors['slope'] = np.around((x1_1 - x1_2) / (x0_1 - x0_2), 2)
    support_vectors['bias'] = np.around(intercept[0], 2)
    print(json.dumps(support_vectors))

solve_svm(data)

