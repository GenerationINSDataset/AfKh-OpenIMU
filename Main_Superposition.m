% Chargement des fichiers INS
lc  = load('donnees_LC.mat');
ind = load('donnees_IND.mat');
tac = load('donnees_TAC.mat');

% Chargement de la trajectoire de référence
ref = load('donnees_REF.mat');

% Construction des trajectoires 2D (East-North)
trajLC  = [lc.p_e_ins;  lc.p_n_ins];
trajIND = [ind.p_e_ins; ind.p_n_ins];
trajTAC = [tac.p_e_ins; tac.p_n_ins];
trajREF = [ref.x'; ref.y'];  % East = x, North = y

% Tracé des trajectoires en 2D
figure;
plot(trajLC(1,:), trajLC(2,:), 'r', 'LineWidth', 1.5); hold on;
plot(trajIND(1,:), trajIND(2,:), 'g', 'LineWidth', 1.5);
plot(trajTAC(1,:), trajTAC(2,:), 'b', 'LineWidth', 1.5);
plot(trajREF(1,:), trajREF(2,:), 'k--', 'LineWidth', 2); % Référence en pointillés noirs

% Mise en forme
grid on;
xlabel('East (m)');
ylabel('North (m)');
legend('Low-Cost INS', 'Industrial INS', 'Tactical INS', 'Reference Trajectory');
axis equal;
