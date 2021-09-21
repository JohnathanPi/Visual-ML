import numpy as np



def entropy(labels):
    hist = np.bincount(labels)
    probas = hist / len(labels)
    lst = [p * np.log2(p) for p in probas if p > 0]
    return -np.sum(lst)

class Node:
    def __init__(self, feature = None, threshold = None, left_child = None, right_child = None, *, value = None):
        self.feature = feature
        self.threshold = threshold
        self.left_child = left_child
        self.right_child = right_child
        self.value = value # applicable if leaf
    
    def is_leaf_node(self):
        return not not self.value
        #return self.value is not None

class DecisionTree:
    def __init__(self, min_samples_split=2, max_depth=100, n_feats=None):
        self.min_samples_split = min_samples_split
        self.max_depth = max_depth
        self.n_feats = n_feats
        self.root = None 
    
    def fit(self, X, y):
        # grow tree
        self.n_feats = 2 # Since we know there are only 2 features
        self.root = self.grow_tree(X, y)
    
    def grow_tree(self, X, y, depth = 0):
        n_samples, n_features = X.shape
        n_labels = len(np.unique(y)) # num of lables in node

        # stopping criteria
        if (depth >= self.max_depth
            or n_labels == 1 # pure tree
            or n_samples < self.min_samples_split):
            leaf_value = self.most_common_label(y)
            return Node(value = leaf_value)
        
    
    
    def most_common_label(y):
        return 0 if np.bincount(y)[0] > np.bincount(y)[1] else 1

