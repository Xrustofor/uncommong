import donations from "./donations";
import sweepstakes from "./sweepstakes";
import fundraisers from "./fundraisers";
import p2pTeams from "./p2pTeams/index";
import campaigns from './campaigns'

export default {
  namespaced: true,
  modules: {
    donations,
    sweepstakes,
    fundraisers,
    p2pTeams,
    campaigns
  }
}