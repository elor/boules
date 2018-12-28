/**
 * RegisterIDsController
 *
 * @return RegisterIDsController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/view', 'ui/state',
  'ui/teammodel', 'ui/playermodel', 'core/random', 'ui/statesaver'], //
function (extend, Controller, View, State, TeamModel, PlayerModel, Random,
  StateSaver) {
  /**
   * Constructor
   */
  function RegisterIDsController ($button, $numteams) {
    RegisterIDsController.superconstructor.call(this, new View(undefined,
      $button))

    this.$button = $button
    this.$numteams = $numteams

    $button.click(this.registerTeams.bind(this))
  }
  extend(RegisterIDsController, Controller)

  RegisterIDsController.prototype.registerTeams = function () {
    var numTeams, id

    numTeams = Number(this.$numteams.val())
    if (isNaN(numTeams)) {
      return
    }

    if (!StateSaver.canSave()) {
      StateSaver.createNewEmptyTree('Tuvero Test-Turnier')
    }

    for (id = 0; id < numTeams; id += 1) {
      State.teams.push(RegisterIDsController.createTeam(id + 1))
    }
  }

  RegisterIDsController.createTeam = function (id) {
    var players, team

    players = []
    while (players.length < State.teamsize.get()) {
      players.push(new PlayerModel('' + id))
    }

    team = new TeamModel(players)

    return team
  }

  return RegisterIDsController
})
