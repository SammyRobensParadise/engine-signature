data = readtable("data.csv");
figure
set(gca,'xtick',0:10)
hold on
plot(data.Prototype,data.CenterFrequency)
for i=1:5
    p1=data.Prototype(i)-0.5;
    p2=data.PassbandStart(i);
    w=1;
    h=data.PassbandEnd(i);
    rectangle("Position",[p1 p2 w h])
end

yyaxis("right")
scatter(data.Prototype,data.MeanAccuracyFromAllTests___,"black","filled")

