(
// s = Server.local;
// s.options.device = "H5";
// s.options.numInputBusChannels = 2;
// s.options.numOutputBusChannels = 2;
s.boot;
)

// read a soundfile
d = Buffer.read(s, "/Users/sammyrobens-paradise/projects/engine-signature/Isolated Failure Sounds/Background\ Noise.wav");

// now play it
(
y = SynthDef("tutorial-PlayBuf",{ arg out = 0, bufnum;
Out.ar( out, PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum), loop: 1))
}).play(s,[\bufnum, d.bufnum ]);
)

(
// create a network address and assign it to a global variable
~toWekinator = NetAddr.new("127.0.0.1", 6448);
)

(
x = {
    var in, fft, array;
	in = PlayBuf.ar(1, d, BufRateScale.kr(d), loop: 1);
    fft = FFT(LocalBuf(1024), in);  // for sampling rates 44100 and 48000
    array = MFCC.kr(fft);
	Out.kr(0, array); // control bus out
}.play;
)

(
c = Bus(\control, 0, 4);
)

// send coefficients
(
r = {

    inf.do {
		c.getn(4, { |val| ~toWekinator.sendMsg("/wek/inputs",*val[0..]) });
		0.01.wait; // 25 frames per second
    }
}.fork
)

r.stop;