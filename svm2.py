import json
import sys
import ast
import numpy as np
from sklearn import svm
from sklearn.utils.extmath import weighted_mode


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
    sv_s = clf.support_vectors_
    for i, sv in enumerate(sv_s):
        sv = sv.tolist()
        support_vectors[i] = sv
    coeffs = clf.coef_.tolist()
    weight_norm = np.linalg.norm(coeffs)
    intercept = clf.intercept_.tolist()
    support_vectors['slope'] = np.around(-(coeffs[0][0] / coeffs[0][1]), 2)
    support_vectors['bias'] = np.around(-(intercept[0] / coeffs[0][1]), 2)
    support_vectors['weight_norm'] = np.around((2 / weight_norm) / 2)
    print(json.dumps(support_vectors))

solve_svm(data)

