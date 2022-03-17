#%%
import csv
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
        Precision: True Positive / True Pos + True False
    """
    accuracies = []
    
    feature_map = {}
    feature_map['Feature-1""'] = "A"
    feature_map['Feature-2""'] = "B"
    feature_map['Feature-3""'] = "C"
    feature_map['Feature-4""'] = "D"
    feature_map[""] = "Delay"
    
    for interval in grouped_intervals:
        correct = 0
        total = 0
        prediction = interval["prediction"]
        data = interval["data"]
        accuracy = 0
        
        for d in data:
            if feature_map[d[1]] == prediction:
                correct += 1
            total += 1
        
        if total != 0:
            accuracy = correct / total
        
        if include_delays and prediction == "Delay":
            accuracy = 1 if len(data) == 0 else 0
            
        accuracies.append(accuracy)
        
    return accuracies
            
        
if  __name__ ==  "__main__":
    ground_truth_csv = 'Real World Failure-300-5.csv'
    experimental_data_csv = 'REAL_5.csv'
    
    include_delays = True
    
    gt = extract_rows(ground_truth_csv) 
    data = extract_rows(experimental_data_csv)
    
    intervals = find_intervals(gt, include_delays)
    grouped_intervals = match_intervals(intervals, data)
    
    x = calculate_accuracy(grouped_intervals, include_delays)
    x = np.mean(x)
    print(x)
