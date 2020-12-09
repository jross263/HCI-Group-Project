import numpy as np
from timeit import default_timer as timer
from numba import vectorize
import time



@vectorize(['float64(float64, float64)'], target='cuda')
def pow_gpu(a, b):
    c = a ** b
    return c


def gpu_loop():
    a = b = np.array(np.random.rand(1, 1, 1, 1), dtype=np.float64)
    pow_gpu(a, b)
    return "Compatible"



if __name__ == '__main__':
    try:
        print(gpu_loop())
    except:
        print("Not Compatible")