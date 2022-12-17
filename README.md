<p align = "center">
<img src="https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/text-logo.png">
 </p>

## Note: The web app is currently down after Heroku (where the site is hosted) removed their basic plan from the site. I'm in the process of porting the sites back end to Python so that it can be hosted someplace else, since not many hosting sevices have basic plans that support apps that use both Python and Node.
For the web app, please visit: https://visual-ml.herokuapp.com (might take between 10-30 seconds on start, PC recommended)

Hey! Visual-ML is a web app that allows you to generate your own datasets,
run classic machine learning algorithms on them and 
view their decision boundaries, all in the browser! 
Currently, the supported models are:
  * Linear Regression
  * Logistic Regression
  * Linear SVM
  * K-Means clustering
  * Decision trees
 
<!--  <p align = "center">
 <img src = "https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/decision_tree_2.png" width = "75%" height = "50%">
  -->
  
<!--  <p float="left">
  <img src="https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/decision_tree_2.png" width = "33%">
  <img src="https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/k%20means.png"  width = "33%"> 
  <img src="https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/Linear%20SVM.png" width = "33%">
</p> -->
 
 Decision Tree             |  K-Means | Linear SVM
:-------------------------:|:-------------------------:|:-------------------------:
![](https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/decision_tree.png)|![](https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/k_means.png)|![](https://github.com/JohnathanPi/ML-Graph-Project/blob/master/public/images/linear_svm.png)
 
# :dna:About:

   * The web apps frontend is made using HTML, CSS and JavaScript. The graph itself 
    is visualized using chart-js. The backend server uses Node.js (express) to run python scripts
    that run the models and send the results back to the frontend (through the server), where the new data is 
    processed and pushed to the chart.

   * All of the models (except Linear SVM) were written from scratch using numpy. For accuracy
     reasons, Linear SVM uses the scikit-learn SVM.SVC with a linear kernel.

   * The dataset generation is done either by clicking on the graph with your mouse or 
    typing in the data manually (including pasting in numpy arrays).


# :books:File structure:

  * index.html & styles.css: The files the display the frontend
  * index.js: This file contains all of the logic that the user
    sees, from DOM manipulation to manipulating the chart object
    (adding points on click, displaying the data that is recieved
    from the server, scaling the graphs size according to the data
    it contains etc..). It also containts the POST and GET requests to the
    server.
  * server.js: Responsible for recieving the data from the user,
    sending it to the python scripts and recieving & sending the data back.
  * models/: The folder containing all of the python scripts that
    run the models on the data.

# :toolbox:How it works:
  * The general workflow is as follows: the graph itself, which is rendered using chart-js, 
    lives as an object inside index.js and is displayed in an html ```<canvas></canvas>```
    tag. After entering the data, clicking the solve button posts the entered data that is
    now inside the graph object to the server, where it spawns a child process that runs
    the requested python script which runs the model on the data, and returns the
    appropriate data needed to graph the decision boundary.
  * ### Linear regression: 
    Linear regression is solved using the closed form matrix multiplication
    solution. The script returns the regression lines slope, bias and R^2.
  * ### Logistic regression: 
    Logistic regression is solved using gradient descent. The script 
    returns the decision boundarys' slope, bias and accuracy. 
  * ### Linear SVM:
    Solved using scikit-learn's SVM.SVC with a linear kernel. A Linear SVM using SGD and the hinge loss
    formulation was attempted (and is in the models/ folder) however it was not consistent and accurate
    enough so is not currently used. The script returns the support vectors coordinates and 
    the slope and biases of the decision boundarys and margin lines.
  * ### K-Means:
    Solved using a *naive k-means* implementation, which iterates over assignment and 
    update steps until convergence. In order to reduce the chance of an empty set occuring,
    where a centroid has no point that is closest to it thus leading it to remain empty,
    the initial centroids are random points in the data, instead of the means of the initial
    random clusters. When an empty set occures, the algorithm stops and the user is shown
    a message asking them to pick a more suitable K or retry. The script returns the coordinates of
    each cluster-mean and the points that belong to each cluster, so that they can all
    be colored differently when they are shown to the user.
  * ### Decision Tree:
    By far the hardest model to implement and decision boundary to draw (detailed
    explanation in the challenges section), the decision tree is implemented using 
    a recursive splitting algorithm that splits according to the lowest entropy split.
    A slightly modified entropy function, which favors splits that lead to larger nodes
    when they are pure in order to lead to better looking decision boundarys, is used.
    The script returns pairs of points representing each line in the decision boundary
    respectively.
 
# :abacus: Challenges:
  
  * ### Drawing the decision tree decision boundary:
    The tree class is built out of nodes that are structured like this:
    ```python
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
    ```
    The main attribute that allows the decision boundaries to by drawn is the
    *border_coords* attribute, that defines the coordinates of the 'box' that
    each node encloses inside the graph. So, for example, the border_coords for
    the root node of the decision tree would be the four edges of the whole graph.
    At the initialization of each new node, it's new border_coords are calculated
    according to its split, which is a tuple containing the value and the axis along 
    which the split is performed, and its parent node, from which it will inherit two
    border coordinates.
    To retrieve the splits themselves, after the tree is built, it is traversed
    in breadth first search order, where at each node, the required information 
    to build it's decision boudnary is pushed into an array which the function returns.
    The reason bfs order was used was to improve readabillity when debugging, and to allow
    for the decision boundary splits to be drawn with a lighter color the deeper they are
    in the tree, however that idea was scrapped when on large trees, the splits became
    barely visible !
  
  * ### Parsing the manual data:
    When the user enters the data manually, multiple formats are supported, however the
    toughest one to implement was numpy arrays (after they were printed). It was 
    important to me to allow for numpy arrays to be pasted, mainly so that generated
    datasets like sk-learns make_moons, make_blobs etc.. could be supported. The problem
    with numpy arrays is that after they are printed, they are displayed with alot of
    whitespace, no commas, and whole numbers displayed as floats
    (for example 3.).
    To parse the data, two main regular expressions are used:
    ```javascript
    const replace_spaces_with_commas = new RegExp(/(?<=\[\ *?\-?\(\d+|([+-]?([0-9]*[.])?[0-9]+\.?\ *))( +?)(?=\ *\-?\(\d+|([+-]?([0-9]*[.])?[0-9]+\.?\ *)\])/g)
    const find_illegal_chars = new RegExp(/([A-Z]|[a-z]|[\!-\']|[\*\+\`]|[\:\;\?\@\^\_\~])+/g)
    ```
    *replace_spaces_with_commas* is used to replace an arbitrary amout of spaces
    (only when they are between two numbers) with a comma, so that they can be treated
    like a legal [x1, x2] point later in the parsing process.
    *find_illegal_chars* is used to find any illegal charecter (for example letters, # etc.).
    When the user inputs new data, it is matched against find_illegal_chars to verify that it
    is indeed legal data!
    Since the data is recieved as a string, floats such as '3.' are problamatic when calling
    `JSON.parse()`, which turns the recieved string into usable data. To solve this, before calling `JSON.parse()`, the 
    'illegal' charecters are replaced with a regex that changes according to the number like so:
    ```javascript
    let trailing_decimal = new RegExp(/\d\.(?!\d)/g) // finds numbers of the type 3., 1. etc...
    do {
        temp = trailing_decimal.exec(parsed_data); // matches them in string
        if (temp) {
            // generate new regex according to the problematic number and replace with legal one
            let temp_regex = new RegExp('[' + parseInt(temp[0]).toString() + '\\.]\\.(?!\\d)', "g")
            parsed_data = parsed_data.replace(temp_regex, parseInt(temp[0]).toString())
        }
    } while (temp);
    ```
  
  * ### Drawing infinite slope:
    For both logistic regression and linear SVM, decision boundaries with infinite slope
    (for example x = 5) can occur. These edge cases need to be handled seperately from the     other cases since numpy will return `np.inf` which raises an error on the frontend.
    For each model this edge case
    is caught beforehand by checking if the slope is equal to `np.inf` or `-np.inf`, then
    handled differently according to the model. For logistic regression, the mean of the
    x-axis values is drawn parallel to the y-axis. For linear SVM, the decision boundry is
    set to be the mean of the support vectors, and the margins are drawn around the           minimum and maximum of the support vectors.

  
  
  

