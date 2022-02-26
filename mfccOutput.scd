(
// s = Server.local;
// s.options.device = "H5";
// s.options.numInputBusChannels = 2;
// s.options.numOutputBusChannels = 2;
s.boot;
)


// Monitor Input
{Out.ar(0,[SoundIn.ar(0), SoundIn.ar(0)])}.play;

(
// create a network address and assign it to a global variable
~toWekinator = NetAddr.new("127.0.0.1", 6448);
)

// test sending a message
~toWekinator.sendMsg("/wek/inputs", 0.0, 0.4, 0.8);

(
x = {
    var in, fft, array;
    in = SoundIn.ar(0);
    fft = FFT(LocalBuf(1024), in);  // for sampling rates 44100 and 48000
    array = MFCC.kr(fft);
	Out.kr(0, array); // control bus out
}.play;
)

c = Bus(\control, 0, 13);

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