function [al,l,h]=enu2llh(p_e,p_n,p_u,tf)

% r1=4.0238134e+6;
% r2=1.3214053e+5;
% r3=4.9304204e+6;
r1= 4.2139819e+5;
r2=5.645379895e+6;
r3=7.047;

for t=1:tf
    [x_ref(t) y_ref(t) z_ref(t)]=enu2xyz(p_e(t),p_n(t),p_u(t),r1,r2,r3);% Transformation ENU à ECEF-XYZ
    [al(t) l(t) h(t)]=xyz2llh(x_ref(t),y_ref(t),z_ref(t));% Transformation ECEF-XYZ à ECEF-LLH  
end

end