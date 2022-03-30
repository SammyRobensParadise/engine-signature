data = readtable("data_with_cost.csv");
figure
set(gca,'xtick',0:10)
hold on
for i=1:5
    p1=data.Prototype(i)-0.5;
    p2=data.PassbandStart(i);
    w=1;
    h=data.PassbandEnd(i);
    c=i+5;
    rectangle("Position",[p1 p2 w h],'FaceColor',[0 c/10 c/10])
end
cost=data.Cost*100;
ylabel("Hz")
yyaxis("right")
plot(data.Prototype,cost,'-o','LineWidth',2,'Color',"#7000ff")
filter_present=[data.Prototype data.MeanAccuracyFromAllTests___];
filter_present(1,:)=[];
title("Passband vs. Prototype vs. Cost")
ylabel("% Cost")
xlabel("Prototype")
legend("Cost")
