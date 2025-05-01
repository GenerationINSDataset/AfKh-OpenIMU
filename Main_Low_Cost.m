close all
clear all 
clc
re=6378393; 
e=1/298.3;  
delt=1; 
te=1;
tf=620;
g0=9.7803; 
data = load('Reference trajectory_XYZ.txt');
x = data(:,1);
y = data(:,2);
z = data(:,3);
for i=1:tf-1
    xdot(i)=(x(i+1)-x(i))/te;
    ydot(i)=(y(i+1)-y(i))/te;
    zdot(i)=(z(i+1)-z(i))/te;
end
xdot=[xdot xdot(1)];
ydot=[ydot ydot(1)];
zdot=[zdot zdot(1)];
for i=1:tf-1
    x2dot(i)=(xdot(i+1)-xdot(i))/te;
    y2dot(i)=(ydot(i+1)-ydot(i))/te;
    z2dot(i)=(zdot(i+1)-zdot(i))/te;
end
x2dot=[x2dot x2dot(1)];
y2dot=[y2dot y2dot(1)];
z2dot=[z2dot z2dot(1)];
p_e=x;p_n=y;p_u=z;
v_e=xdot;v_n=ydot;v_u=zdot;
a_e=x2dot;a_n=y2dot;a_u=z2dot;
for i=1:tf
psi(i)  = atan2(v_n(i),v_e(i));
theta(i)= atan2(v_u(i),v_e(i));
phi(i)  = atan2(v_u(i),v_n(i));
end
fig_num=0;
fig_num=fig_num+1;
figure(fig_num)
plot(p_e,p_n,'r.','linewidth',2);
xlabel('East (meters)')
ylabel('North (meters)')
grid
fig_num=fig_num+1;
figure(fig_num)
plot3(p_e,p_n,p_u,'r','linewidth',2);
xlabel('East (meters)')
ylabel('North (meters)')
zlabel('Up (meters)')
grid
w=7.292115147e-5;
a=[a_e;a_n;a_u];
v=[v_e;v_n;v_u];
for t=1:tf
sinphi(t)   = sin(phi(t));
cosphi(t)   = cos(phi(t));
sintheta(t) = sin(theta(t));
costheta(t) = cos(theta(t));
sinpsi(t)   = sin(psi(t));
cospsi(t)   = cos(psi(t));
    
R(:,:,t)    = [1    (sinphi(t)*sintheta(t))/costheta(t)   (cosphi(t)*sintheta(t))/costheta(t);
               0    cosphi(t)                             -sinphi(t)                         ;
               0    sinphi(t)/costheta(t)                 cosphi(t)/costheta(t)              ];
     
cbn(:,:,t)  = [costheta(t)*cospsi(t)    sinphi(t)*sintheta(t)*cospsi(t)- cosphi(t)*sinpsi(t)   cosphi(t)*sintheta(t)*cospsi(t)+sinphi(t)*sinpsi(t);
               costheta(t)*sinpsi(t)    sinphi(t)*sintheta(t)*sinpsi(t)+cosphi(t)*cospsi(t)    cosphi(t)*sintheta(t)*sinpsi(t)-sinphi(t)*cospsi(t);
               -sintheta(t)             sinphi(t)*costheta(t)                                  cosphi(t)*costheta(t)                              ];
          
cnb(:,:,t)=cbn(:,:,t)'; 
end
trans=cbn;
for t=1:tf-1
psidot(t) = (psi(t+1)-psi(t))/te;
thetadot(t) =(theta(t+1)-theta(t))/te;
phidot(t)   =(phi(t+1)-phi(t))/te;
end
psidot=[psidot psidot(1)];
phidot=[phidot phidot(1)];
thetadot=[thetadot thetadot(1)];
ulerdot = [ phidot;  thetadot; psidot ];
for t=1:tf
    omega(:,t) = inv( R(:,:,t))* ulerdot(:,t) ;  
    p(t)       = omega(1,t);
    q(t)       = omega(2,t);
    r(t)       = omega(3,t);
end
[la,lo,h]=enu2llh(p_e,p_n,p_u,tf);
la_ref(1)=la(1);
lo_ref(1)=lo(1);
h_ref(1)=h(1);
for t= 1:tf
g(t)=9.7803+0.051799*sin(la(t))^2-(0.94114e-10)*h(t);
rn(t)=re*(1-2*e+3*e*sin(la(t))^2);
rm(t)=re*(1+e*sin(la(t))^2); 
wie(1,t)=0;
wie(2,t)=w*cos(la(t));
wie(3,t)=w*sin(la(t));
wen(1,t)=-v(2,t)/(rn(t)+h(t));
wen(2,t)=v(1,t)/(rm(t)+h(t));
wen(3,t)=v(1,t)/(rm(t)+h(t))*tan(la(t));
ww=(2*wie+wen);
fn(:,t)=a(:,t)+[0,-ww(3,t),ww(2,t);ww(3,t),0,-ww(1,t);-ww(2,t),ww(1,t),0]*v(:,t)+[0;0;g(t)];
fb(:,t)=cnb(:,:,t)*fn(:,t); 
wib(:,t)=[p(t); q(t) ;r(t)]+cnb(:,:,t)*(wen(:,t)+wie(:,t));

wib(:,t) = wib(:,t) + randn(3,1)*1.75e-3 + randn(3,1)*4.85e-5;

fb(1:2,t) = fb(1:2,t) + (randn(2,1)*9.81e-5 + randn(2,1)*9.81e-5)*g0;

fb(3,t) = fb(3,t) + (randn(1,1)*9.81e-4 + randn(1,1)*9.81e-4)*g0;

end
for t=1:tf-1
la_ref(t+1)=la_ref(t)+v(2,t)*delt/(rm(t)+h_ref(t));
lo_ref(t+1)=lo_ref(t)+v(1,t)*delt/((rm(t)+h_ref(t))*cos(la_ref(t)));
h_ref(t+1)=h_ref(t)+v(3,t)*delt;
end
vv(:,1)=[v_e(1);v_n(1);v_u(1)]; 
a0(1)=la(1);
l0(1)=lo(1);
h0(1)=h(1); 
phi_ins(1)=phi(1);
theta_ins(1)=theta(1);
psi_ins(1)=psi(1);
T(:,:,1)=cbn(:,:,1); 
p_e_ins(1)=x(1); 
p_n_ins(1)=y(1);
p_u_ins(1)=z(1);
for t=1:tf-1
g(t)=9.7803+0.051799*sin(a0(t))^2-(0.94114e-10)*h0(t);
rn(t)=re*(1-2*e+3*e*sin(a0(t))^2);
rm(t)=re*(1+e*sin(a0(t))^2); 
wie(1,t)=0;
wie(2,t)=w*cos(a0(t));
wie(3,t)=w*sin(a0(t));
fn(:,t)=T(:,:,t)*fb(:,t); 
dvv(1,t)=fn(1,t)+(2*w*sin(a0(t))+vv(1,t)*tan(a0(t))/(rm(t)+h0(t)))*vv(2,t)-(2*w*cos(a0(t))+vv(1,t)/(rm(t)+h0(t)))*vv(3,t);
dvv(2,t)=fn(2,t)-(2*w*sin(a0(t))+vv(1,t)*tan(a0(t))/(rm(t)+h0(t)))*vv(1,t)-vv(2,t)*vv(3,t)/(rn(t)+h0(t));
dvv(3,t)=fn(3,t)+(2*w*cos(a0(t))+vv(1,t)/(rm(t)+h0(t)))*vv(1,t)+vv(2,t)*vv(2,t)/(rn(t)+h0(t))-g(t);
vv(1,t+1)=vv(1,t)+dvv(1,t)*delt;
vv(2,t+1)=vv(2,t)+dvv(2,t)*delt;
vv(3,t+1)=vv(3,t)+dvv(3,t)*delt;
wep(:,t)=[-vv(2,t)/(rn(t)+h0(t));vv(1,t)/(rm(t)+h0(t));vv(1,t)*tan(a0(t))/(rm(t)+h0(t))];
ww_ins(:,t)=(2*wie(:,t)+wep(:,t));
wpb(:,t)=wib(:,t)-inv(T(:,:,t))*(wep(:,t)+wie(:,t)); 
Rpqr(:,:,1)    = [1    (sinphi(1)*sintheta(1))/costheta(1)   (cosphi(1)*sintheta(1))/costheta(1);
                  0    cosphi(1)                             -sinphi(1)                         ;
                  0    sinphi(1)/costheta(1)                 cosphi(1)/costheta(1)              ];
eulerdot_ins(:,t)=Rpqr(:,:,t)*wpb(:,t);
phi_ins(t+1)=phi_ins(t)+eulerdot_ins(1,t)*delt;
theta_ins(t+1)=theta_ins(t)+eulerdot_ins(2,t)*delt;
psi_ins(t+1)=psi_ins(t)+eulerdot_ins(3,t)*delt;
c(:,:,1)=[-sin(l0(1)),cos(l0(1)),0;-sin(a0(1))*cos(l0(1)),-sin(a0(1))*sin(l0(1)),cos(a0(1));cos(a0(1))*cos(l0(1)),cos(a0(1))*sin(l0(1)),sin(a0(1))];
dc(:,:,t)=[0,wep(3,t),-wep(2,t);-wep(3,t),0,wep(1,t);wep(2,t),-wep(1,t),0]*c(:,:,t);
c(:,:,t+1)=c(:,:,t)+dc(:,:,t)*delt;
a0(t+1)=asin(c(3,3,t+1)); 
if c(3,1,t+1)>0
l0(t+1)=atan(c(3,2,t+1)/c(3,1,t+1));
elseif c(3,2,t+1)>0
   l0(t+1)=atan(c(3,2,t+1)/c(3,1,t+1))+pi; 
else
   l0(t+1)=atan(c(3,2,t+1)/c(3,1,t+1))-pi; 
end
h0(t+1)=h0(t)+vv(3,t+1)*delt;  
p_e_ins(t+1)=p_e_ins(t)+vv(1,t)*delt; 
p_n_ins(t+1)=p_n_ins(t)+vv(2,t)*delt; 
p_u_ins(t+1)=p_u_ins(t)+vv(3,t)*delt; 
q0_ins(t)=cos(phi_ins(t)/2)*cos(theta_ins(t)/2)*cos(psi_ins(t)/2)+sin(phi_ins(t)/2)*sin(theta_ins(t)/2)*sin(psi_ins(t)/2);
q1_ins(t)=sin(phi_ins(t)/2)*cos(theta_ins(t)/2)*cos(psi_ins(t)/2)-cos(phi_ins(t)/2)*sin(theta_ins(t)/2)*sin(psi_ins(t)/2);
q2_ins(t)=cos(phi_ins(t)/2)*sin(theta_ins(t)/2)*cos(psi_ins(t)/2)+sin(phi_ins(t)/2)*cos(theta_ins(t)/2)*sin(psi_ins(t)/2);
q3_ins(t)=cos(phi_ins(t)/2)*cos(theta_ins(t)/2)*sin(psi_ins(t)/2)-sin(phi_ins(t)/2)*sin(theta_ins(t)/2)*cos(psi_ins(t)/2);
sinphi(t)   = sin(phi_ins(t));
cosphi(t)   = cos(phi_ins(t));
sintheta(t) = sin(theta_ins(t));
costheta(t) = cos(theta_ins(t));
sinpsi(t)   = sin(psi_ins(t));
cospsi(t)   = cos(psi_ins(t));
Rpqr(:,:,t+1)=[1    (sinphi(t+1)*sintheta(t+1))/costheta(t+1)   (cosphi(t+1)*sintheta(t+1))/costheta(t+1);
               0    cosphi(t+1)                                 -sinphi(t+1)                             ;
               0    sinphi(t+1)/costheta(t+1)                   cosphi(t+1)/costheta(t+1)                ];
     
T(:,:,t+1)=[costheta(t+1)*cospsi(t+1)    sinphi(t+1)*sintheta(t+1)*cospsi(t+1)- cosphi(t+1)*sinpsi(t+1)   cosphi(t+1)*sintheta(t+1)*cospsi(t+1)+sinphi(t+1)*sinpsi(t+1);
            costheta(t+1)*sinpsi(t+1)    sinphi(t+1)*sintheta(t+1)*sinpsi(t+1)+cosphi(t+1)*cospsi(t+1)    cosphi(t+1)*sintheta(t+1)*sinpsi(t+1)-sinphi(t+1)*cospsi(t+1);
            -sintheta(t+1)               sinphi(t+1)*costheta(t+1)                                        cosphi(t+1)*costheta(t+1)                                    ];
end
for t=1:tf
h_ins(t)=h0(t);
la_ins(t)=a0(t);
lo_ins(t)=l0(t);
end
fig_num=fig_num+1;
figure(fig_num)
plot3(p_e,p_n,p_u,'r','linewidth',2);grid on;hold on;
plot3(p_e_ins,p_n_ins,p_u_ins,'g','linewidth',2);grid on;
xlabel('East (meters)')
ylabel('North (meters)')
zlabel('Up (meters)')
legend('Reference', 'Estimated');
fig_num=fig_num+1;
figure(fig_num)
plot(p_e,p_n,'r','linewidth',2);grid on;hold on;
plot(p_e_ins,p_n_ins,'g','linewidth',2);grid on;
xlabel('East (meters)')
ylabel('North (meters)')
legend('Reference', 'Estimated');
fig_num=fig_num+1;
figure(fig_num)
plot(p_e,'r','linewidth',2);grid on;hold on;
plot(p_e_ins,'g','linewidth',2);grid on;
title('Position East de référence et estimée');
fig_num=fig_num+1;
figure(fig_num)
plot(p_n,'r','linewidth',2);grid on;hold on;
plot(p_n_ins,'g','linewidth',2);grid on;
title('Position North de référence et estimée');
fig_num=fig_num+1;
figure(fig_num)
plot(p_u,'r','linewidth',2);grid on;hold on;
plot(p_u_ins,'g','linewidth',2);grid on;
title('Position Up de référence et estimée');
fig_num=fig_num+1;
figure(fig_num)
plot(phi,'r','linewidth',2);grid on;hold on; 
plot(phi_ins,'g','linewidth',2);grid on;
title('Angle de roulis de référence et estimée');
fig_num=fig_num+1;
figure(fig_num)
plot(theta,'r','linewidth',2);grid on;hold on;
plot(theta_ins,'g','linewidth',2);grid on;
title('Angle de tangage de référence et estimée');
fig_num=fig_num+1;
figure(fig_num)
plot(psi,'g','linewidth',2);grid on;hold on;
plot(psi_ins,'r','linewidth',2);grid on;
title('Angle de lacet de référence et estimée');
MSEe=0;MSEn=0;MSEu=0;
k=620;
for i=1:k
MSEe=MSEe+(p_e(i)-p_e_ins(i)).^2;
MSEn=MSEn+(p_n(i)-p_n_ins(i)).^2;
MSEu=MSEu+(p_u(i)-p_u_ins(i)).^2;
end 
MSEe=sqrt(MSEe/k);
MSEn=sqrt(MSEn/k);
MSEu=sqrt(MSEu/k);
RMSEe=MSEe;
RMSEn=MSEn;
RMSEu=MSEu;
RMSEe
RMSEn
RMSEu
save('donnees_LC.mat', 'p_e_ins', 'p_n_ins', 'p_u_ins')





