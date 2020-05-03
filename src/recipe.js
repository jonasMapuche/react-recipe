'use strict';

module.exports = {
  name:function (req, res) {
      res.send({ recipe: name(req.body)});
    },
  weight:function (req, res) {
      res.send({ weigth: weight(req.body)});
    },
  equation:function (req, res) {
      res.send({ express: nome});
  }
};

function weight(val) {
  const bulkMin = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default').map(v => v.bulk)); 
  return bulkMin;
}

function name(val) {

  // acid - ok

  const acidRaiz = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'H').length).reduce((pre, pos) => pre + pos, 0);
  const acidRaizWithO = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').length).reduce((pre, pos) => pre + pos, 0);
  const eAcid = () => {if (acidRaiz > 0) {return true}};
  const eHydracid = () => {if (eAcid() == true && acidRaizWithO == 0) {return true}};
  const eOxyacid = () => {if (eAcid() == true && acidRaizWithO > 0) {return true}}; 
  
  // base

  const baseO = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').length).reduce((pre, pos) => pre + pos, 0);
  const baseH = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'H').length).reduce((pre, pos) => pre + pos, 0);

  const eBase = () => {if (baseO > 0 && baseH > 0) {return true}};

  // water

  const waterH = val.filter(v => v.type == 'mol').map(v => v.role.filter(v => v.type == 'default' && v.name == 'H' && v.amount == 2).length).reduce((pre, pos) => pre + pos, 0);
  const waterO = val.filter(v => v.type == 'mol').map(v => v.role.filter(v => v.type == 'default' && v.name == 'O' && v.amount == 1).length).reduce((pre, pos) => pre + pos, 0);

  const eWater = () => {if (waterH > 0 && waterO > 0) {return true}};

  // amount cation

  const amoutCation = val.filter(v => v.type == 'ion' && v.charge > 0).length;
  const amoutAnion = val.filter(v => v.type == 'ion' && v.charge < 0).length;

  // salt

  const eSaltNeutral = () => {if (eAcid() != true && eBase() != true) {return true}};
  const eSaltBase = () => {if (amoutCation == 1 && amoutAnion == 2 && eBase() ==true) {return true}};
  const eSaltAcid = () => {if (amoutCation == 2 && amoutAnion == 1 && eAcid() == true) {return true}};
  const eSaltDoubleCation = () => {if (amoutCation == 2 && eAcid() != true && amoutAnion == 1) {return true}};
  const eSaltDoubleAnion = () => {if (amoutCation == 1 && eBase() != true && amoutAnion == 2) {return true}};
  const eSaltHydrated = () => {if ((eWater() == true) && (eSaltNeutral() == true || eSaltBase() == true || eSaltAcid() == true || eSaltDoubleCation() == true || eSaltDoubleAnion() == true)) {return true}};


  const oxide = val.filter(v => v.type == 'ion' && v.charge != 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').length).reduce((pre, pos) => pre + pos, 0);
  const amount = val.map(v => v.role.length).reduce((pre, pos) => pre + pos, 0);
  const rating = val.filter(v => v.type == 'ion' && v.charge != 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'O').map(v => v.rating)).reduce((pre, pos) => pre + pos, '');
  const eOxideMetal = () => {if (oxide == 1 && amount == 2 && rating == 'metal') {return true}};
  const eOxideNotMetal = () => {if (oxide == 1 && amount == 2 && rating != 'metal') {return true}};

  //return eOxide();

  // names

  if (eOxideMetal() == true) {
    return 'Óxido: ' + nameOxideMetal(val);
  }

  if (eOxideNotMetal() == true) {
    return 'Óxido: ' + nameOxideNotMetal(val);
  }

  if (eSaltAcid() == true) { 
    return 'Sal Ácido: ' + nameSaltAcid(val);
  };

  if (eSaltBase() == true) {
    return 'Sal Base: ' + nameSaltBase(val);
  };
  
  if (eSaltDoubleCation() == true) {
    return 'Sal Dublo Cátion: ' + nameSaltDoubleCation(val);
  };

  if (eSaltDoubleAnion() == true) {
    return 'Sal Duplo Ânion: ' + nameSaltDoubleAnion(val);
  };

  if (eSaltHydrated() == true) {
    return 'Sal Hidratado: ' + nameSaltHydrated(val);
  };

  if (eSaltNeutral() == true) {
    return 'Sal Neutro: ' + nameSaltNeutral(val);
  };
  
  if (eBase() == true) {
    return 'Base: ' + nameBase(val);
  }

  if (eHydracid() == true) {
    return 'Ácido: ' + nameHydracid(val);
  };

  if (eOxyacid() == true) {
    return 'Ácido: ' + nameOxyacid(val);
  };

}

function suffixSalt (charge, amount, name) { 
  if (amount == 2 && charge == -1) 
    return name + '-ito'
  else if (amount == 2 && charge == -2) return name + '-ato'
  else return name + '-eto';
}

function nameSaltNeutral (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const chargeAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.charge).reduce((pre, pos) => pre + pos, 0);
  const amoutAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').length).reduce((pre, pos) => pre + pos, 0);
  return suffixSalt(chargeAnion, amoutAnion, nameAnion) + ' de ' + nameCation;
}

function nameSaltAcid (val)
{
  const nameAnion1 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)[0]).reduce((pre, pos) => pre + pos, '');
  const nameAnion2 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)[1]).reduce((pre, pos) => pre + pos, '');
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'H').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const chargeAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.charge).reduce((pre, pos) => pre + pos, 0);
  const amoutAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').length).reduce((pre, pos) => pre + pos, 0);
  return 'hidrogênio-' + suffixSalt(chargeAnion, amoutAnion, nameAnion1 + '-' + nameAnion2) + ' de ' + nameCation;
}

function nameSaltBase (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'O' && v.name != 'H').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const chargeAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'O' && v.name != 'H').map(v => v.charge).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  const amoutAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'O' && v.name != 'H').length).reduce((pre, pos) => pre + pos, 0);
  return 'hidroxi-' + suffixSalt(chargeAnion, amoutAnion, nameAnion) + ' de ' + nameCation;
}

function nameSaltDoubleCation (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const nameCation1 = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName))[0].reduce((pre, pos) => pre + pos, '');
  const nameCation2 = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName))[1].reduce((pre, pos) => pre + pos, '');
  const chargeAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.charge).reduce((pre, pos) => pre + pos, 0);
  const amoutAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').length).reduce((pre, pos) => pre + pos, 0);

  return suffixSalt(chargeAnion, amoutAnion, nameAnion.replace(',', '-')) + ' de ' + nameCation1 + ' e ' + nameCation2;
}

function nameSaltDoubleAnion (val)
{
  const nameAnion1 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName))[0].reduce((pre, pos) => pre + pos, '');
  const chargeAnion1 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.charge)[0];
  const amoutAnion1 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').length)[0];;
  const lengthNameAnion2 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName))[1].reduce((pre, pos) => pre + pos, 0).length;
  const nameAnion2 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName))[1].reduce((pre, pos) => pre + (pos + '-'), '').substr(0, lengthNameAnion2);
  const chargeAnion2 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.charge)[1];
  const amoutAnion2 = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').length)[1];
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');

  return suffixSalt(chargeAnion1, amoutAnion1, nameAnion1) + ' ' + suffixSalt(chargeAnion2, amoutAnion2, nameAnion2) + ' de ' + nameCation;
}

function nameSaltHydrated (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '').replace(',', '-');
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '').replace(',', '-');
  const numberWater = val.filter(v => v.type == 'mol').map(v => v.multiplier).reduce((pre, pos) => pre + pos, 0);
  return nameAnion + ' de ' + nameCation + ' ' + prefixMultiplier(numberWater, 'hidratado');
}

function measure(val) {
  switch (val) {
    case 'H':
      return 1;
    case 'P':
      return 2;
    case 'C':
      return 3;
    case 'S':
      return 4;
    case 'I':
      return 5;
    case 'Br':
      return 6;
    case 'Cl':
      return 7;
    case 'N':
      return 8;
    case 'O':
      return 9;
    case 'F':
      return 10;
    default:
      return 11;
  }
}

function nameBase (val)
{
  const nameCation = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const chargeAnion = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.charge).reduce((pre, pos) => pre + pos, 0);
  return 'hidróxido de ' + nameCation + ' ' + chargeAnion;
}

function nameHydracid (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '').replace(',','-');
  return 'ácido ' + nameAnion + '-ídrico';
}

function nameOxyacid (val)
{
  const nameAnion = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name != 'O').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const amoutAnionO = val.filter(v => v.type == 'ion' && v.charge < 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').map(v => v.amount).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  const amoutAnionH = val.filter(v => v.type == 'ion' && v.charge > 0).map(v => v.role.filter(v => v.type == 'default' && v.name == 'H').map(v => v.amount).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  return 'ácido ' + suffixAcid(amoutAnionO, amoutAnionH, nameAnion);
}

function suffixAcid (amountO, amountH, name) { 
  if ((amountO == 1 && amountH == 1) || (amountO == 2 && amountH > 1)) return 'hipo-' + name + '-oso'
  else if ((amountO == 2 && amountH == 1) || (amountO == 3 && amountH > 1)) return name + '-oso'
  else if ((amountO == 3 && amountH == 1) || (amountO == 4 && amountH > 1)) return name + '-ico'
  else return 'per-' + name + '-ico';
}

function nameOxideMetal (val)
{
  const name = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name != 'O').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const charge = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').map(v => v.charge).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  return 'óxido de ' + name + ' ' + charge;
}

function nameOxideNotMetal (val)
{
  const nameNotO = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name != 'O').map(v => v.fullName)).reduce((pre, pos) => pre + pos, '');
  const amountNotO = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name != 'O').map(v => v.amount).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  const amountO = val.filter(v => v.type == 'ion').map(v => v.role.filter(v => v.type == 'default' && v.name == 'O').map(v => v.amount).reduce((pre, pos) => pre + pos, 0)).reduce((pre, pos) => pre + pos, 0);
  return prefixOxide(amountO, 'óxido') + ' de ' + prefixMultiplier(amountNotO, nameNotO);
} 

function prefixMultiplier(amount, name) {
  switch (amount) {
    case 1:
      return 'mono-' + name;
    case 2:
      return 'di-' + name;
    case 3:
      return 'tri-' + name;
    case 4:
      return 'quadri-' + name;
    case 5:
      return 'penta-' + name;
    case 6:
        return 'hexa-' + name;
    case 7:
        return 'epi-' + name;
    default:
      return 'x-' + name;
  }
}

