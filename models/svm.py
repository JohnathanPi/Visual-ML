import json
import sys
import ast
import numpy as np
from sklearn import svm
from sklearn.utils.extmath import weighted_mode


data = sys.argv[1]
def solve_svm(data):
    try:
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
        coeffs = clf.coef_
        intercept = clf.intercept_.tolist()
        support_vectors['slope'] = np.around(-(coeffs[0][0] / coeffs[0][1]), 2) # -(w1/w2)
        support_vectors['bias'] = np.around(-(intercept[0] / coeffs[0][1]), 2) # -(b/w2)
        support_vectors['bias-1'] = np.around(-((intercept[0] + 1) / coeffs[0][1]), 2) # (-(b+1)/w2)
        support_vectors['bias-2'] = np.around(-((intercept[0] - 1) / coeffs[0][1]), 2) # (-(b-1)/w2)
        support_vectors['flag'] = 0
        if(support_vectors['slope'] == -np.inf or support_vectors['slope'] == np.inf):
            # edge case with infinite slope
            support_vectors['slope'] = np.mean(sv_s[:, 0]) # x-axis intercept will be mean of support vectors
            support_vectors['bias'] = 0
            support_vectors['bias-1'] = np.min(sv_s[:, 0]) # let margin would be at leftmost(smallest x-val) sv
            support_vectors['bias-2'] = np.max(sv_s[:, 0]) # right margin would be at rightmost(largest x-val) sv
            support_vectors['flag'] = 1
        print(json.dumps(support_vectors))
    except Exception as e:
        print('0')

solve_svm(data)

