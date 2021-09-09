import json
import sys
import ast
import numpy as np
from sklearn import svm


# data = "{'''1''': [{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}], '''-1''': [{'x': -5, 'y':-3}, {'x': -1, 'y': -4}, {'x': -2, 'y': -7}]}"
# data = "{'''1''': [{'x': 2, 'y':2}, {'x': 1, 'y': 1}], '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# data = "{'''1''': [{'x': 8, 'y':16}, {'x': 13, 'y': 16}], 
# '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"

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
    clf = svm.LinearSVC() 
    clf.fit(X, y)
    support_vectors = {}
    # sv_s = clf.support_vectors_
    coeffs = clf.coef_.tolist()
    # for i, sv in enumerate(sv_s):
    #     sv = sv.tolist()
    #     support_vectors[i] = sv
    support_vectors['slope'] = np.around(coeffs[0][0] / coeffs[0][1], 2)
    support_vectors['bias'] = np.around(clf.intercept_[0] / coeffs[0][1], 2)
    print(json.dumps(support_vectors))

solve_svm(data)

