import json
import sys
import ast
import numpy as np
from sklearn import svm
from sklearn.utils.extmath import weighted_mode



# data = "{'''1''': [{'x': 5, 'y':3}, {'x': 1, 'y': 4}, {'x': 2, 'y': 7}], '''-1''': [{'x': -5, 'y':-3}, {'x': -1, 'y': -4}, {'x': -2, 'y': -7}]}"
# data = "{'''1''': [{'x': 2, 'y':2}, {'x': 1, 'y': 1}], '''-1''': [{'x': -2, 'y':2}, {'x': -1, 'y': 1}]}"
# data = "{'''1''': [{'x': 10, 'y':10}], '''-1''': [{'x': 5, 'y': 5}]}"
# data = "{'''1''': [{'x': -3, 'y':1}], '''-1''': [{'x': -2, 'y': -5}, {'x': 5, 'y': -1}]}"
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
    # coeffs = clf.coef_.tolist()
    coeffs = clf.coef_
    # weight_norm = np.linalg.norm(coeffs)
    weight_norm = np.sqrt(np.sum(coeffs[0] ** 2))
    w_hat = clf.coef_[0] / (np.sqrt(np.sum(clf.coef_[0] ** 2)))
    # print('what is', w_hat)
    # print('weight norm is', weight_norm)
    margin = 1 / np.sqrt(np.sum(clf.coef_[0] ** 2))
    # print('margin is', margin)
    intercept = clf.intercept_.tolist()
    support_vectors['slope'] = np.around(-(coeffs[0][0] / coeffs[0][1]), 2)
    support_vectors['bias'] = np.around(-(intercept[0] / coeffs[0][1]), 2)
    support_vectors['bias-1'] = np.around(-((intercept[0] + 1) / coeffs[0][1]), 2)
    support_vectors['bias-2'] = np.around(-((intercept[0] - 1) / coeffs[0][1]), 2)
    # support_vectors['margin_dist'] = (w_hat[0] * margin + w_hat[1] * margin)
    print(json.dumps(support_vectors))


# abline(b/w[1],-w[2]/w[1])
# abline((b+1)/w[1],-w[2]/w[1],lty=2)
# abline((b-1)/w[1],-w[2]/w[1],lty=2)

solve_svm(data)

