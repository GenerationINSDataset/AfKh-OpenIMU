function [p_e_ins,p_n_ins,p_u_ins]=llh2enu(a0,l0,h0,tf)

% r1=4.0238134e+6;
% r2=1.3214053e+5;
% r3=4.9304204e+6;
r1= 4.2139819e+5;
r2=5.645379895e+6;
r3=7.047;

for t=1:tf
    [x_ins(t) y_ins(t) z_ins(t)]=llh2xyz(a0(t),l0(t),h0(t));% Transformation ECEF-LLH à ECEF-XYZ
    [p_e_ins(t) p_n_ins(t) p_u_ins(t)]=xyz2enu(x_ins(t),y_ins(t),z_ins(t),r1,r2,r3);% Transformation ECEF-XYZ à ENU
end
end
   