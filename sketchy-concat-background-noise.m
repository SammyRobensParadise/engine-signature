clost all;
filename = "A_Concat.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1)))) 
title('A')
xlabel('Frequency (Hz)')
ylabel('Y in db')

hold on

filename = "Background Noise.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1))))

figure;
filename = "B_Concat.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1)))) 
title('Single-Sided Amplitude Spectrum of y(t)')
xlabel('Frequency (Hz)')
ylabel('Y in db')

hold on


filename = "Background Noise.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1))))

figure;
filename = "C_Concat.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
title('Single-Sided Amplitude Spectrum of y(t) C')
plot(f,10*log10(2*abs(Y(1:NFFT/2+1)))) 

hold on

filename = "Background Noise.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1))))

figure;
filename = "D_Concat.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
title('Single-Sided Amplitude Spectrum of y(t) D')
plot(f,10*log10(2*abs(Y(1:NFFT/2+1)))) 

hold on

filename = "Background Noise.wav";
[y,Fs] = audioread(filename);

y = y(:,1);

T = 1/Fs;                     % Sample time
L = numel(y);                     % Length of signal
NFFT = 2^nextpow2(L); % Next power of 2 from length of y
Y = fft(y,NFFT)/L;
f = Fs/2*linspace(0,1,NFFT/2+1);
% Plot single-sided amplitude spectrum.
plot(f,10*log10(2*abs(Y(1:NFFT/2+1)))) 
