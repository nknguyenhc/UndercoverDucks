import numpy as np

## for the change matrix, a[i][j] means the probability of going to port[i], given it is in port[j]
def get_ship_proportions_over_time(initial, change, num_of_iterations):
    changeiter = np.eye(len(change))
    list_of_iter = []
    for i in range(num_of_iterations):
        changeiter = np.dot(changeiter, change.T) 
        list_of_iter.append(np.dot(initial, changeiter))
    return np.array(list_of_iter)

def get_new_change(current_change, deltas, similarity_matrix):
    current_change = current_change.tolist()
    deltas = deltas.tolist()
    similarity_matrix = similarity_matrix.tolist()
    
    def convert_to_truth_list(xs):
        return list(map(lambda x: (False if (x == 0) else True), xs))
    def proportion_list(sim_list, truth_list):
        a = list(map(lambda x: (0 if truth_list[sim_list.index(x)] == True else x), sim_list))
        return list(map(lambda x: x/sum(a) ,a)) 
    
    similarity_matrix = np.array(similarity_matrix).T
    similarity_matrix = similarity_matrix.tolist()
   
    def changed_list(orixs, delxs):
        a = list(map(lambda t: [x * -t for x in proportion_list(similarity_matrix[delxs.index(t)], convert_to_truth_list(delxs))],delxs))
        result = delxs
        for i in range(len(a)):
            result = [x + y for x, y in zip(a[i], result)]
        res = [x + y for x, y in zip(result, orixs)]
        return res
    return np.array(list(map(lambda x: changed_list(x, deltas[current_change.index(x)]),current_change)))