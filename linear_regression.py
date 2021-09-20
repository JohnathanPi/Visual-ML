import json
import sys
import ast
import numpy as np

# {"data":[{"x":-2,"y":18},{"x":-1,"y":17},{"x":2,"y":12},{"x":3,"y":9},{"x":6,"y":3}],"flag":0}
"""[{'x':-2,'y':6},{'x':1,'y':2},{'x':7,'y':-8}]"""
"""{'data':[{'x':-2,'y':6},{'x':1,'y':2},{'x':7,'y':-8}], 'flag': 1, 'lambda': 0}"""

incoming_data = sys.argv[1]
data_objs = ast.literal_eval(incoming_data)
data = data_objs['data']
flag = data_objs['flag']
reg_param = data_objs['lambda']
x_vals = []
y_vals = []
count = 0
for point in data:
    count += 1
    x_vals.append(point['x'])
    y_vals.append(point['y'])
X = np.array([[1 for i in range(count)], x_vals])
y = np.array(y_vals)

def linear_regression(X, y, flag, reg_param):
    try:
        # if len(x_vals) == len(y_vals) == 1:
        #     raise ValueError('Not enough data')
        # (X^TX)^-1
        if flag == 0:
            inv_xt_x = np.linalg.inv(np.matmul(X, X.T)) 
        elif flag == 1:
            inv_xt_x = np.linalg.inv(np.matmul(X + reg_param*np.eye(X.shape[0], X.shape[1]), X.T)) 
        # (X^Ty)
        x_ty = np.matmul(inv_xt_x, X)
        w = np.matmul(x_ty, np.transpose(y))
        final_weights = (np.around(w, 2)).ravel()
        slope, bias = final_weights[1], final_weights[0]
        weight_dict = {"slope" : slope, 'bias' : bias}
        # Calcualte R^2
        def f_i(a, b, x):
            return a*x + b
        y_mean = np.mean(y_vals)
        ssr = sst = 0
        for i in range(count):
            ssr += (y_vals[i] - f_i(slope, bias, x_vals[i]))**2
            sst += (y_vals[i] - y_mean)**2
        if (sst == 0):
            r_squared = 1
        else:
            r_squared = np.around(1 - (ssr/ sst), 2)
        weight_dict['R^2'] = r_squared
        print(json.dumps(weight_dict))
    except Exception as e:
        if (str(e) == 'Not enough data'):
            print("0")
        else:
            print("1")

def clip(beta, alpha):
    clipped = np.minimum(beta, alpha)
    clipped = np.maximum(clipped, -alpha)
    return clipped

def proxL1Norm(betaHat, alpha, penalizeAll = True):

    out = betaHat - clip(betaHat, alpha)
    
    if not penalizeAll:
        out[0] = betaHat[0]

    return out

def lasso_regression(X, y, reg_param):
    maxIter = 300
    alpha = 0.01
    beta = np.zeros(2)
    for i in range(maxIter):
        grad = X @ (X.T @ beta - y)
        beta = proxL1Norm(beta - alpha*grad, alpha * reg_param)
    weight_dict = {}
    weight_dict['slope'] = np.around(beta[1], 2)
    weight_dict['bias'] = np.around(beta[0], 2)
    print(json.dumps(weight_dict))

# linear_regression(X, y, flag, reg_param)
lasso_regression(X, y, reg_param)