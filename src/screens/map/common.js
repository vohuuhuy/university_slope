import footerInfo from './data/footerInfo.json'

export const getFooterInfo = key => {
  switch (key) {
    case "G1": return footerInfo.G1
    case "G2": return footerInfo.G2
    case "G3": return footerInfo.G3
    case "G4": return footerInfo.G4
    case "G5": return footerInfo.G5
    case "G6": return footerInfo.G6
    case "G7": return footerInfo.G7
    case "G8": return footerInfo.G8
    case "K1": return footerInfo.K1
    case "K2": return footerInfo.K2
    case "K3": return footerInfo.K3
    case "K4": return footerInfo.K4
    case "K5": return footerInfo.K5
    case "K6": return footerInfo.K6
    case "K7": return footerInfo.K7
    case "K8": return footerInfo.K8
    case "SVD": return footerInfo.SVD
    case "TV": return footerInfo.TV
    case "KHC": return footerInfo.KHC
  }
  return {}
}