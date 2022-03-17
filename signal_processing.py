#%%
# test
import scipy.io.wavfile
import scipy.signal
import numpy as np
import matplotlib.pyplot as plt

#%%
print(scipy.__version__)

#%%
# read ECG data from the WAV file
sampleRate, data = scipy.io.wavfile.read('/Users/joshuawilkinson/Projects/engine-signature/Isolated Failure Sounds/B_Concat.wav')
times = np.arange(len(data))/sampleRate

# apply a 3-pole lowpass filter at 0.1x Nyquist frequency
b, a = scipy.signal.butter(3, 0.1) 
filtered = scipy.signal.filtfilt(b, a, data)

plt.figure(figsize=(10, 4))

plt.subplot(121)
plt.plot(times, data)
plt.title("ECG Signal with Noise")
plt.margins(0, .05)

plt.subplot(122)
plt.plot(times, filtered)
plt.title("Filtered ECG Signal")
plt.margins(0, .05)

plt.tight_layout()
plt.show()
# %%
import matplotlib.pyplot as plt
import numpy as np
import wave
import sys


spf = wave.open('/Users/joshuawilkinson/Projects/engine-signature/Isolated Failure Sounds/B_Concat.wav', "r")

# %%
