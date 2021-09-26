import json
import sys
import ast
import numpy as np

## Loading data from graph

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
max_x = int(np.ceil(np.max(X[:, 0])))
max_y = int(np.ceil(np.max(X[:, 1])))

# Information gain function

def entropy(labels):
    hist = np.bincount(labels)
    probas = hist / len(labels)
    lst = [p * np.log2(p) for p in probas if p > 0]
    if (-np.sum(lst) == 0):
        # Punishes splits that lead to smaller nodes when the node is pure for better and 'smarter' looking decision boundaries
        return -np.sum(lst) - len(labels) 
    return -np.sum(lst) 

# Calculate medians of values to find possible splits

def return_medians(feature_vector):
    medians = []
    feature_vector = np.unique(sorted(feature_vector))
    for i in range(len(feature_vector) - 1):
        medians.append((feature_vector[i] + feature_vector[i + 1]) / 2)
    return(np.unique(medians))


class Node():
    def __init__(self, X, y, is_x_child = 'root', parent = None, left_child = None, right_child = None, split = None, border_coords = []):
        self.X = X
        self.y = y
        self.is_x_child = is_x_child
        self.parent = parent
        self.left_child = left_child
        self.right_child = right_child
        self.split = split
        self.border_coords = border_coords
    
    # Used to get parents split
    def return_split(self, node):
        if node == None:
            return None
        return node.split 
    # Used to get parents type
    def return_node_type(self, node):
        if node.is_x_child == None:
            return 'root'
        return node.is_x_child
    # For debugging
    def __repr__(self) -> str:
        return 'data:' + '\n' + str(self.X) + '\n' + 'labels:' + '\n' + str(self.y) + '\n' +  f'is {self.is_x_child} child' + '\n' +\
                f'split on {self.split}, derives from {self.return_split(self.parent)}' + '\n'

    
# Calculates the size each node takes on the final graph, according to its split direction and if its a left or right child

def calc_new_coords(parent_node, split, side):
        value = split[0]
        axis = split[1]
        top_left = parent_node.border_coords[0]
        top_right = parent_node.border_coords[1]
        bottom_left = parent_node.border_coords[2]
        bottom_right = parent_node.border_coords[3]
        if side == 'left' and axis == 0: # Vertical left cut
            new_border_coords = [top_left, (value, top_left[1]), bottom_left, (value, bottom_left[1])]
            return new_border_coords
        if side == 'left' and axis == 1: # Horizontal bottom cut
            new_border_coords = [(bottom_left[0], value), (bottom_right[0], value), bottom_left, bottom_right]
            return new_border_coords
        if side == 'right' and axis == 0: # Vertical right cut
            new_border_coords = [(value, top_right[1]), top_right, (value, bottom_right[1]), bottom_right]
            return new_border_coords
        if side == 'right' and axis == 1: # Horizontal top cut
            new_border_coords = [top_left, top_right, (top_left[0], value), (top_right[0], value)]
            return new_border_coords
        
class DecisionTree:
    def __init__(self, splits, max_depth=100, root = None, n_feats = 2):
        self.max_depth = max_depth
        self.n_feats = n_feats
        self.root = None 
        self.splits = [] # List that stores all splits in the tree

    def best_split(self, node):
        X = node.X
        y = node.y
        if (len(X) == 1):
            # print('RECIEVED SINGLE DATA POINT')
            return
        num_of_features = X.shape[1]
        entropies = {} # Dict to keep all possible splits and their information gain
        for feature in range(num_of_features): # Test each feature
            possible_splits = return_medians(X[:, feature]) 
            for split in possible_splits: # Test each split
                left_split_labels = [y[i] for i in range(len(X[:, feature])) if X[:, feature][i] < split]
                right_split_labels = [y[i] for i in range(len(X[:, feature])) if X[:, feature][i] >= split]
                curr_split_entropy = (entropy(left_split_labels) + entropy(right_split_labels)) / 2
                entropies[(feature, split)] = curr_split_entropy
        if not entropies: # Handles edge case where there are two of the same class on the same point
            return None, None, None
        best_split, best_feat = min(entropies, key = entropies.get, default = 0)[1], min(entropies, key = entropies.get, default = 0)[0]
        node.split = (best_split, best_feat)
        left_split = [X[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] < best_split] # data in left node
        right_split = [X[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] >= best_split]  # data in right node
        left_split_labels = [y[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] < best_split] 
        right_split_labels = [y[i] for i in range(len(X[:, best_feat])) if X[:, best_feat][i] >= best_split]
        left_node = Node(np.array(left_split), left_split_labels, 'left', node, None, None, node.split, calc_new_coords(node, node.split, 'left'))
        right_node = Node(np.array(right_split), right_split_labels, 'right', node, None, None, node.split, calc_new_coords(node, node.split, 'right'))
        return [left_node, right_node, (best_split, best_feat)] # Returns the new nodes and the found best split


    def grow_tree(self, node, depth = 0):
        # Initial function that starts the growing 
        X = node.X
        y = node.y
        num_of_labels = len(np.unique(y))
        if (num_of_labels == 1):
            return
        left_node, right_node, split = self.best_split(node)
        if not (left_node and right_node and split): # Handles edge case where two classes on same point
            return
        node.left_child, node.right_child = left_node, right_node
        self.splits.append(split)
        return self.grow_tree(left_node, depth + 1), self.grow_tree(right_node, depth + 1) # Recursive call to continue growing

def traverse_tree_bfs(root, splits = []): # Useful for debugging and retrieving the final splits
    if root is None:
        return
    queue = []
    queue.append([root, 'root'])
    while(len(queue) > 0):
        node = queue.pop(0)
        node = node[0]
        if node.return_split(node.parent) != None: 
            splits.append([node.return_node_type(node.parent), node.return_split(node.parent), node.border_coords])
        if node.left_child is not None:
            queue.append([node.left_child, 'left child'])
        if node.right_child is not None:
            queue.append([node.right_child, 'right_child'])
    return splits
#                                                       top left   top right bottom left bottom right
#root_node = Node(X, y, 'root', None, None, None, None, [(-max_x, max_y), (max_x, max_y), (-max_x, -max_y), (max_x, -max_y)]) # Initial root node
root_node = Node(X, y, 'root', None, None, None, None, [(-max_x - 15, max_y + 15), (max_x + 15, max_y + 15), (-max_x - 15, -max_y - 15), (max_x + 15, -max_y - 15)]) # Initial root node
tree = DecisionTree(splits = [], root = root_node) # Tree object
tree.grow_tree(root_node) 
final_splits = traverse_tree_bfs(root_node)
decision_boundaries = {}
for split in final_splits:
    value = split[1][0]
    axis = split[1][1]
    final_points = []
    node_box = split[2]
    for point in node_box:
        # The splits on the graph are the points where the new coordinate box does not inherit from it's parent
        if value == point[axis]: 
            final_points.append({'x':point[0], 'y':point[1]})
    decision_boundaries[i] = final_points[:2] 
    i += 1
result = {}
# Removes duplicate decision boundaries 
for key,value in decision_boundaries.items():
    if value not in result.values():
        result[key] = value
print(json.dumps(result))
