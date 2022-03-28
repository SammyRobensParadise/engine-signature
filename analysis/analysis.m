data = readtable("data.csv");
figure
set(gca,'xtick',0:10)
hold on
for i=1:5
    p1=data.Prototype(i)-0.5;
    p2=data.PassbandStart(i);
    w=1;
    h=data.PassbandEnd(i);
    c=i+3;
    rectangle("Position",[p1 p2 w h],'FaceColor',[0 c/10 c/10])
end
plot(data.Prototype,data.CenterFrequency,'-o','LineWidth',2,'Color',"#7000ff")
ylabel("Hz")
yyaxis("right")
scatter(data.Prototype,data.MeanAccuracyFromAllTests___,"black","filled")
title("Passband vs. Prototype vs. Percent Accuracy")
ylabel("Accuracy")
xlabel("Prototype")
legend("Center Frequency","Accuracy")
