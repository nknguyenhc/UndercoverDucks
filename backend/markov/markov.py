import numpy as np

## for the change matrix, a[i][j] means the probability of going to port[i], given it is in port[j]
def get_ship_proportions_over_time(initial, change, num_of_iterations):
    changeiter = np.eye(len(change))
    list_of_iter = []
    for i in range(num_of_iterations):
        changeiter = np.dot(changeiter, change) 
        list_of_iter.append(np.dot(initial, changeiter))
    return list_of_iter


def get_new_change(current_change, deltas, similarity_matrix):
    
    current_change = current_change.tolist()
    deltas = deltas.tolist()
    similarity_matrix = similarity_matrix.tolist()
    
    def convert_to_truth_list(xs):
        return list(map(lambda x: (False if (x == 0) else True), xs))
    def proportion_list(sim_list, truth_list):
        henz = sim_list[:]
        for i in range(len(sim_list)):
            if truth_list[i] == True:
                henz[i] = 0
        henz = np.array(henz)
        if ((henz == 0).all()):
            return henz.tolist()
        else:
            henz = henz.tolist()
            return list(map(lambda x: x/sum(henz), henz))

    similarity_matrix = np.array(similarity_matrix).T
    similarity_matrix = similarity_matrix.tolist()
   
    def changed_list(orixs, delxs):
        a = delxs[:]
        c = convert_to_truth_list(a)
        for i in range(len(delxs)):
            if delxs[i] == 0:
                delxs[i] = [0] * len(a)
            else:
                proplist = np.array(proportion_list(similarity_matrix[i], c))
                delxs[i] = (proplist * -delxs[i]).tolist()
        b = np.array(delxs[:])
        result = b.sum(axis=0)
        res = [x + y + z for x, y, z in zip(result, orixs, a)]
        return res
    for k in range(len(current_change)):
        current_change[k] = changed_list(current_change[k],deltas[k])
    return np.array(current_change)