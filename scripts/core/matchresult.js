/**
 * MatchResult, a simple match results class
 *
 * @return MatchResult
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/matchmodel'], function (extend, MatchModel) {
  function min (array) {
    return Math.min.apply(Math, array)
  }

  function max (array) {
    return Math.max.apply(Math, array)
  }

  /**
   * Constructor
   *
   * @param match
   *          a MatchModel instance of which the result is to be kept
   * @param score
   *          an array of scored points
   */
  function MatchResult (match, score) {
    MatchResult.superconstructor.call(this, match && match.teams, match &&
      match.id, match && match.group)

    // empty default constructor for list-based construction
    if (score === undefined) {
      this.score = []
      return
    }

    if (this.teams.length !== score.length) {
      throw new Error('MatchResult(): array lengths differ: ' +
        this.teams.length + '<>' + score.length)
    }

    this.score = score.slice(0)
  }
  extend(MatchResult, MatchModel)

  /**
   * Disable the finish() function
   */
  MatchResult.prototype.finish = undefined

  /**
   * @return true if this result is a bye, false otherwise
   */
  MatchResult.prototype.isBye = function () {
    return this.isResult() && this.length === 2 &&
      this.getTeamID(0) === this.getTeamID(1)
  }

  /**
   * crude save function as if it was ripped right out of the Model class.
   *
   * @return a serializable data object on success, undefined otherwise
   */
  MatchResult.prototype.save = function () {
    var data = MatchResult.superclass.save.call(this)

    data.s = this.score

    return data
  }

  /**
   * restore from a serialized data object
   *
   * @param data
   *          the data object
   * @return true on success, false otherwise
   */
  MatchResult.prototype.restore = function (data) {
    if (!MatchResult.superclass.restore.call(this, data)) {
      return false
    }

    this.score = data.s

    return true
  }

  MatchResult.prototype.getWinner = function () {
    var maxpoints, winner, winnerIndex

    maxpoints = max(this.score)
    winnerIndex = this.score.indexOf(maxpoints)
    if (winnerIndex === this.score.lastIndexOf(maxpoints)) {
      winner = this.teams[winnerIndex]

      return winner
    }
    return undefined
  }

  MatchResult.prototype.getLoser = function () {
    var loser, loser2, minpoints

    minpoints = min(this.score)

    loser = this.teams[this.score.indexOf(minpoints)]
    loser2 = this.teams[this.score.lastIndexOf(minpoints)]

    if (loser === loser2) {
      return loser
    }
    return undefined
  }

  MatchResult.prototype.SAVEFORMAT = Object
    .create(MatchModel.superclass.SAVEFORMAT)
  MatchResult.prototype.SAVEFORMAT.s = [Number]

  return MatchResult
})
