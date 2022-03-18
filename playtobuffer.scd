(
// s = Server.local;
// s.options.device = "H5";
// s.options.numInputBusChannels = 2;
// s.options.numOutputBusChannels = 2;
s.boot;
)

/*(

~class = "C";
//Let a be the number of samples of a type
a = ['01','02','03','04','05','06', '07', '08', '09', '10'];

//C is an array we want to populate with buffers
c = ['01','02','03','04','05','06', '07', '08', '09', '10'];

//Create a routine to populate c with buffers
x = Routine({ a.do({ arg item, i; c[0] = Buffer.read(s,("/Users/joshuawilkinson/Projects/engine-signature/Isolated Failure Sounds/"++ ~class ++ "_" ++ item ++".wav")); }); });
x.nextN(1);
c.postln;
)*/

// read a soundfile
// d = Buffer.read(s, "/Users/joshuawilkinson/Projects/engine-signature/Real World Failures/Real World Failure-300-2.wav");

// e = Buffer.read(s, b[2]);
// d = c[3]

(
~class = "B";
d = Buffer.read(s, "/Users/joshuawilkinson/Projects/engine-signature/Isolated Failure Sounds/" ++ ~class ++ "_Concat.wav");
~channels = 2;
)

(

d = Buffer.read(s, "/Users/joshuawilkinson/Projects/engine-signature/Real World Failures/Real World Failure-300-9.wav");
~channels = 1;
)

(

d = Buffer.read(s, "/Users/joshuawilkinson/Projects/engine-signature/Isolated Failure Sounds/Background Noise.wav");
~channels = 2;
)


// now play it
// replace c[2] with c[i] for desired sound from list of buffers
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
in = PlayBuf.ar(~channels, d, BufRateScale.kr(d), loop: 1);
in = BPF.ar(in, freq:1250, rq:(1100/1250) , mul: 1.0, add: 0.0);

fft = FFT(LocalBuf(1024), in); // for sampling rates 44100 and 48000
array = MFCC.kr(fft);
Out.kr(0, array); // control bus out
}.play;




c = Bus(\control, 0, 13);



// send coefficients

r = {

    inf.do {
    	c.getn(13, { |val| ~toWekinator.sendMsg("/wek/inputs",*val[0..]) });
    	0.01.wait; // 25 frames per second
    }

}.fork
)

r.stop;
