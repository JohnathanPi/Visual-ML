import json
import sys
import ast
import numpy as np

# {"data":[{"x":-2,"y":18},{"x":-1,"y":17},{"x":2,"y":12},{"x":3,"y":9},{"x":6,"y":3}],"flag":0}
"""[{'x':-2,'y':6},{'x':1,'y':2},{'x':7,'y':-8}]"""
"""{'data':[{'x':-2,'y':6},{'x':1,'y':2},{'x':7,'y':-8}], 'flag': 1, 'lambda': 0}"""
"""{'1':[{'x':-9,'y':11},{'x':-10,'y':-7}],'-1':[{'x':7,'y':4}]}"""

data = sys.argv[1]
data_obj = ast.literal_eval(data)
X = []
y = []
for label in data_obj:
    for i in range(len(data_obj[label])):
        curr = data_obj[label][i]
        X.append([curr['x'], curr['y']])
        y.append(int(label))
X = np.array(X)
y = np.array(y)

def entropy(labels):
    hist = np.bincount(labels)
    probas = hist / len(labels)
    lst = [p * np.log2(p) for p in probas if p > 0]
    return -np.sum(lst) 


def return_medians(feature_vector):
    medians = []
    feature_vector = np.unique(sorted(feature_vector))
    for i in range(len(feature_vector) - 1):
        medians.append((feature_vector[i] + feature_vector[i + 1]) / 2)
    # print('The medians are', np.unique(medians))
    return(np.unique(medians))

# X = np.array([[-7, 12], [-7, 7], [-7, 1], [0, 1], [0, -3], [0, -8]])
# y = np.array([1, 0, 1, 1, 0, 1])


class Node():
    def __init__(self, X, y, left_child = None, right_child = None):
        self.X = X
        self.y = y
        self.left_child = left_child
        self.right_child = right_child
    
    def __repr__(self) -> str:
        return 'data:' + '\n' + str(self.X) + '\n' + 'labels:' + '\n' + str(self.y) + '\n'


class DecisionTree:
    def __init__(self, splits, max_depth=100, n_feats = 2):
        self.max_depth = max_depth
        self.n_feats = n_feats
        self.splits = []
        self.root = None

    def best_split(self, X, y):
        if (len(X) == 1):
            # print('RECIEVED SINGLE DATA POINT')
            return
        num_of_features = X.shape[1]
        entropies = {}
        for feature in range(num_of_features):
            possible_splits = return_medians(X[:, feature])
            for split in possible_splits:
                left_split_labels = [y[i] for i in range(len(X[:, feature])) if X[:, feature][i] < split]
                right_split_labels = [y[i] for i in range(len(X[:, feature])) if X[:, feature][i] >= split]
                curr_split_entropy = (entropy(left_split_labels) + entropy(right_split_labels)) / 2
                entropies[(feature, split)] = curr_split_entropy
        best_split, best_feat = min(entropies, key = entropies.get)[1], min(entropies, key = entropies.get)[0]
        left_split = [X[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] < best_split]
        right_split = [X[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] >= best_split]  
        left_split_labels = [y[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] < best_split]
        right_split_labels = [y[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] >= best_split]
        left_node = Node(np.array(left_split), left_split_labels, None, None)
        right_node = Node(np.array(right_split), right_split_labels, None, None)
        return [left_node, right_node, (best_split, best_feat)]


    def grow_tree(self, X, y, depth = 0):
        # function that will recieve all data and build tree
        # stopping conditions
        num_of_labels = len(np.unique(y))
        if (depth >= self.max_depth or num_of_labels == 1):
            return
        left_node, right_node, split = self.best_split(X, y)
        self.splits.append(split)
        # print(self.splits)
        return self.grow_tree(left_node.X, left_node.y), self.grow_tree(right_node.X, right_node.y)
    
tree = DecisionTree([])
tree.grow_tree(X, y)
final_splits = {}
for i in range(len(tree.splits)):
    final_splits[i] = tree.splits[i]

print(json.dumps(final_splits))