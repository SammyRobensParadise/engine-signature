#%%
import csv
from sklearn import metrics
import math
import os
import numpy as np
    
def extract_rows(file="Real World Failure-300-5.csv"):
    file = open(file)
    csvreader = csv.reader(file)
    rows = []
    
    for row in csvreader:
        next = row
        if len(row) == 1:
            next = row[0].split(" ")
        rows.append(next)
        
    return rows

def find_intervals(rows, include_delays):
    return find_intervals_with_delays(rows) if include_delays else find_intervals_no_delays(rows)

def find_intervals_no_delays(rows):
    intervals = []
    new_interval = [0,0,""]
    
    for row in rows:
        cl = row[2]
        t_milli = float(row[1])*1000
        
        if cl != "Delay":
            new_interval[0] = t_milli
            new_interval[2] = cl
        else:
            new_interval[1] = t_milli
        
        if new_interval[0] > 0 and new_interval[0] < new_interval[1]:
            intervals.append(new_interval)
            new_interval = [0,0, ""]
            
    return intervals

def find_intervals_with_delays(rows):
    intervals = []
    new_interval = [0,0,""]
    
    for row in rows:
        cl = row[2]
        t_milli = float(row[1])*1000
        
        if new_interval[0] == 0:
            new_interval[0] = t_milli
            new_interval[2] = cl
        else:
            new_interval[1] = t_milli
            
            intervals.append(new_interval)
            
            new_interval = [t_milli,0,cl]
       
    return intervals
       
def match_intervals(intervals, rows):
    grouped_intervals = []
    for interval in intervals:
        x = {"prediction": interval[2]}
        x["data"] = find_data_in_interval(interval, rows)
        grouped_intervals.append(x)
    return grouped_intervals

def find_data_in_interval(interval, rows):
    data = []
    rows = rows[1:]
    for row in rows:
        if  interval[0] < float(row[0]) < interval[1] and row[1] != "":
            data.append(row)
    return data
        
def calculate_accuracy(grouped_intervals, include_delays):
    """_summary_

    Args:
        grouped_intervals (_type_): 
        Intervals of test data along with correct label.

    Returns:
        _type_:
        Returns Statistical information, including accuracy and precision as defined by:
        
        Accuracy: (True Positive + True Neg) / Total 
        Precision: True Positive / True Pos + True False ~ for each feature
    """
    
    feature_map = {}
    feature_map['Feature-1""'] = "A"
    feature_map['Feature-2""'] = "B"
    feature_map['Feature-3""'] = "C"
    feature_map['Feature-4""'] = "D"
    feature_map[""] = "Delay"
    
    predicted = []
    actual = []
    
    for interval in grouped_intervals:
        prediction = interval["prediction"]
        data = interval["data"]
        
        for d in data:          
            predicted.append(feature_map[d[1]])
            actual.append(prediction)
                
        if include_delays and prediction == "Delay":
            if len(data) == 0:
                predicted.append("Delay")
            else:             
                predicted.append(feature_map[d[1]])
            actual.append("Delay")
        
    return predicted, actual

def calculate_cross_entropy(ground_truth_csv, experimental_data_csv):
    gt = extract_rows(ground_truth_csv) 
    data = extract_rows(experimental_data_csv)
    
    intervals = find_intervals(gt, include_delays)
    grouped_intervals = match_intervals(intervals, data)
    
    predicted, actual = calculate_accuracy(grouped_intervals, include_delays)
    p = {}
    p['A'] = 0.0001
    p['B'] = 0.0001
    p['C'] = 0.0001
    p['D'] = 0.0001
    p['total'] = 0
    
    y = {}
    y['A'] = 0.0001
    y['B'] = 0.0001
    y['C'] = 0.0001
    y['D'] = 0.0001
    y['total'] = 0
    
    
    
    for i in predicted:
        p[i] += 1
        p['total'] += 1
    for i in actual:
        y[i] += 1
        y['total'] += 1
        
    total = y['total']
        
    c_e = -( (y['A']/total) *math.log(p['A']/total,2) + (y['B']/total)*math.log(p['B']/total,2) + (y['C']/total)*math.log(p['C']/total,2) + (y['D']/total)*math.log(p['D']/total,2))


    recall = (metrics.recall_score(y_true=actual, y_pred=predicted, average='macro'))
    accuracy = (metrics.accuracy_score(y_true=actual, y_pred=predicted))
    return c_e, recall, accuracy

def load_directory(path):
    file_names = []
    i = 0
    for file in os.listdir(path):
        if i == 10:
            break
        if file.endswith(".csv"):
           file_names.append(file)
        i += 1
    return file_names

def cross_entropy_bulk(experimental_dir, ground_truth_path, real_filename):
    # print(os.listdir(real_path))
    c_e_vals = []
    recall_vals = []
    accuracy_vals = []
    for n in range(1,11):
        ground_truth_csv = f'{ground_truth_path}Real World Failure-300-{n}.csv'
        experimental_data_csv = f'{experimental_dir}{real_filename}{n}.csv'
        c_e, recall, accuracy = calculate_cross_entropy(ground_truth_csv, experimental_data_csv)
        c_e_vals.append(c_e)
        recall_vals.append(recall)
        accuracy_vals.append(accuracy)
    # print(c_e_vals)
    return np.mean(c_e_vals), np.mean(recall_vals), np.mean(accuracy_vals)
        
    
#%%        
if  __name__ ==  "__main__":
    # num = 5
    # ground_truth_csv = f'Real World Failure-300-{num}.csv'
    # experimental_data_csv = f'REAL_{num}.csv'
    
    collected_dir = "../collected_data/"
    real_filename = "REAL_"
    
    real_data_dir = "../test-data/Real World Failures/"
    
    
    
    include_delays = False
    
    # gt = extract_rows(ground_truth_csv) 
    # data = extract_rows(experimental_data_csv)
    
    # intervals = find_intervals(gt, include_delays)
    # grouped_intervals = match_intervals(intervals, data)
    
    # predicted, actual = calculate_accuracy(grouped_intervals, include_delays)
    
    # c_e = calculate_cross_entropy(predicted, actual)    
    
    # print(f"Cross Entropy Loss: {c_e}")
    
    avg_cross_entropy, avg_recall, avg_accuracy = cross_entropy_bulk(collected_dir, real_data_dir, real_filename)
    print(f"Prototype Average Cross Entropy Loss: {avg_cross_entropy}")
    print(f"Prototype Average Recall: {avg_recall}")
    print(f"Prototype Average Accuracy: {avg_accuracy}")
    
    w1, w2, w3 = 0.33, 0.33, 0.33
    
    cost = w1*avg_cross_entropy + w2*(1-avg_accuracy) + w3*(1-avg_recall)
    print(f"Cost Value: {cost}")
    # print(load_directory(collected_dir))

    # print("**** CONFUSION MATRIX ****")
    # print(metrics.confusion_matrix(actual, predicted))

    # Print the precision and recall, among other metrics
    # print(metrics.classification_report(actual, predicted, digits=3))
    
# %%
