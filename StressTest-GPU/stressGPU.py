import numpy as np
from timeit import default_timer as timer
from numba import vectorize
import time


try:
    @vectorize(['float64(float64, float64)'], target='cuda')
    def pow_gpu(a, b):
        c = a ** b
        for j in range(5):
        # for j in range(25):
            c = c ** (1 / b)
            c = c ** b
        return c


    def gpu_loop():
        result = []
        # vec_size = 105
        vec_size = 21

        a = b = np.array(np.random.rand(vec_size, vec_size, vec_size, vec_size), dtype=np.float64)
        c = np.zeros(vec_size, dtype=np.float64)

        # while True:
        start = timer()
        pow_gpu(a, b)
        result.append("GPU took {0} seconds".format(timer() - start))

        return result

    # def pow_cpu(a, b, c):
    #     for j in range(a.size):
    #         c[j] = a[j] ** b[j]
    #
    #
    # def cpu_loop(loc, process_num):
    #     loc.acquire()
    #     try:
    #         print("Process Number {0} has started".format(process_num))
    #     finally:
    #         loc.release()
    #     vec_size = 10000000
    #
    #     a = b = np.array(np.random.sample(vec_size), dtype=np.float64)
    #     c = np.zeros(vec_size, dtype=np.float64)
    #     start = timer()
    #
    #     while True:
    #         pow_cpu(a, b, c)
    #         loc.acquire()
    #         try:
    #             print("Process {0} is still running, the load loop took {1} seconds".format(process_num, timer() - start))
    #         finally:
    #             loc.release()
    #
    #         start = timer()



    if __name__ == '__main__':
        all_processes = []
        results = []
        t_end = time.time() + 10
        while time.time() < t_end:
            results.append(gpu_loop())
        print(results)
except:
    print("ERROR")


