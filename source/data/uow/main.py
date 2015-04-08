import codecs
import os
from collections import OrderedDict
import math
import operator

f = codecs.open("scores.csv","r")
sports = {}

for line in f:
    parts = line.strip().split(",")
    sports[parts[0]] = parts[1:]
    print(parts)
print(sports)
def get_sports_vec():
    for k in sports.keys():
        if k != "sport":
            yield k, sports[k]

def load_test():
    f = codecs.open("cw_games_test_cases.csv", "r")
    case = 1
    test_cases = []
    for line in f:
        parts = line.strip().split(",")
        if case == 1:
            case += 1
        else:
            test_cases.append(parts[0:])
        case += 1
    return test_cases

def cosim(v1, v2):
    dot_product = sum(float(n1) * float(n2) for n1,n2 in zip(v1, v2) )
    magnitude1 = math.sqrt (sum(float(n) ** 2 for n in v1))
    magnitude2 = math.sqrt (sum(float(n) ** 2 for n in v2))
    return dot_product / (magnitude1 * magnitude2)


def score_cases():
    out = codecs.open("results.csv","w")
    for case in load_test():
        scores = {}
        for k, vec in get_sports_vec():
            scores[k] = cosim(case,vec)
        sorted_scores = sorted(scores.items(), key=lambda x: x[1])
        sorted_scores.reverse()
        out.write("%s,%s,%s\n" % (sorted_scores[0][0], sorted_scores[1][0], sorted_scores[2][0]))
    out.close()

score_cases()
