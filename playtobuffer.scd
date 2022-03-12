(
// s = Server.local;
// s.options.device = "H5";
// s.options.numInputBusChannels = 2;
// s.options.numOutputBusChannels = 2;
s.boot;
)

//Let a be the number of samples of a type
a = ['1','2','3','4','5','6', '7', '8', '9', '10];

//C is an array we want to populate with buffers
c = ['1','2','3','4','5','6', '7', '8', '9', '10];

//Create a routine to populate c with buffers
x = Routine({ a.do({ arg item, i; c[i] = Buffer.read(s,("~/engine-signature/Real World Failures/Real World Failure-300-" ++ item ++".wav")); }); });
x.nextN(1);
c.postln;

// read a soundfile
// d = Buffer.read(s, "/Users/joshuawilkinson/Projects/engine-signature/Real World Failures/Real World Failure-300-2.wav");

// e = Buffer.read(s, b[2]);

// now play it
// replace c[2] with c[i] for desired sound from list of buffers
(
y = SynthDef("tutorial-PlayBuf",{ arg out = 0, bufnum;
Out.ar( out, PlayBuf.ar(1, bufnum, BufRateScale.kr(bufnum), loop: 1))
}).play(s,[\bufnum, c[2].bufnum ]);
)

(
// create a network address and assign it to a global variable
~toWekinator = NetAddr.new("127.0.0.1", 6448);
)

(
x = {
var in, fft, array;
in = PlayBuf.ar(1, d, BufRateScale.kr(d), loop: 1);
fft = FFT(LocalBuf(1024), in); // for sampling rates 44100 and 48000
array = MFCC.kr(fft);
Out.kr(0, array); // control bus out
}.play;
)

(
c = Bus(\control, 0, 13);
)

// send coefficients
(
r = {

    inf.do {
    	c.getn(13, { |val| ~toWekinator.sendMsg("/wek/inputs",*val[0..]) });
    	0.01.wait; // 25 frames per second
    }

}.fork
)

r.stop;
