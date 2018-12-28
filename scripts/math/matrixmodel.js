/**
 * MatrixModel, a square matrix representation.
 *
 * We don't inherit from ListModel or VectorModel since they're compact
 * representations, but this class is supposed to handle extremely sparse
 * matrices. So, we're defining and maintaining our own arrays.
 *
 * @return MatrixModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/rle'], function (extend, Model, RLE) {
  /**
   * Constructor
   *
   * @param size
   *          size of the matrix. defaults to 0
   */
  function MatrixModel (size) {
    MatrixModel.superconstructor.call(this)

    this.data = []
    this.length = Math.max(0, size || 0)

    return this
  }
  extend(MatrixModel, Model)

  MatrixModel.prototype.EVENTS = {
    'resize': true
  }

  /**
   * removes the rows and cols associated with the index from the matrix
   *
   * @param index
   *          {Integer} index
   * @return {MatrixModel} this
   */
  MatrixModel.prototype.remove = function (index) {
    if (index >= this.length || index < 0) {
      return this
    }

    this.data.splice(index, 1)
    this.data.forEach(function (b) {
      b.splice(index, 1)
    })

    this.length -= 1

    this.emit('resize')

    return this
  }

  /**
   * resizes the matrix while taking care of
   *
   * @param size
   *          the new size
   * @return this on success, undefined otherwise
   */
  MatrixModel.prototype.resize = function (size) {
    if (size === undefined) {
      return undefined
    }
    if (size < 0) {
      size = 0
    }

    if (this.length > size) {
      this.data.splice(size)

      this.data.forEach(function (row) {
        row.splice(size)
      })
    }

    this.length = size

    this.emit('resize')

    return this
  }

  /**
   * retrieves the value from the given indices.
   *
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @return value at (row, col). Defaults to 0
   */
  MatrixModel.prototype.get = function (row, col) {
    if (Math.min(row, col) < 0 || Math.max(row, col) >= this.length) {
      console.warn('MatrixModel.get(): out of bounds')
      return undefined
    }
    if (!this.data[row]) {
      return 0
    }

    return this.data[row][col] || 0
  }

  /**
   * sets the value at the given indices and allocates/frees the cell/row if
   * possible
   *
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @param value
   *          integer value to store in position (row, col)
   * @return {MatrixModel} this
   */
  MatrixModel.prototype.set = function (row, col, value) {
    var rowref

    if (Math.min(row, col) < 0 || Math.max(row, col) >= this.length) {
      console.warn('MatrixModel.set(): out of bounds')
      return undefined
    }

    rowref = this.data[row]

    if (value) {
      if (!rowref) {
        rowref = this.data[row] = []
      }
      rowref[col] = value
    } else if (rowref) {
      delete rowref[col]
    }

    return this
  }

  /**
   * write the main diagonal elements to a vector
   *
   * @param vector
   *          a VectorModel instance to write the results to
   * @return vector on success, undefined otherwise
   */
  MatrixModel.prototype.diagonal = function (vector) {
    var index

    vector.resize(this.length)

    for (index = 0; index < vector.length; index += 1) {
      vector.set(index, this.get(index, index))
    }

    return vector
  }

  /**
   * perform a Matrix*Vector multiplication and store the results in the
   * provided output vector
   *
   * @param outVec
   *          the output vector
   * @param vec
   *          the input vector
   * @return outVec on success, containing this*vec. undefined otherwise.
   */
  MatrixModel.prototype.multVector = function (outVec, vec) {
    var row, col, sum

    if (vec.length !== this.length) {
      console.warn('MatrixModel.multVector: different input lengths: ' +
          this.length + '<>' + vec.length)
      return undefined
    }

    outVec.resize(vec.length)

    for (row = 0; row < outVec.length; row += 1) {
      sum = 0

      for (col = 0; col < outVec.length; col += 1) {
        sum += this.get(row, col) * vec.get(col)
      }

      outVec.set(row, sum)
    }

    return outVec
  }

  /**
   * perform a Vector*Matrix multiplication and store the results in the
   * provided output vector
   *
   * @param outVec
   *          the output vector
   * @param vec
   *          the input vector
   * @return outVec on success, containing this*vec. undefined otherwise.
   */
  MatrixModel.prototype.vectorMult = function (outVec, vec) {
    var row, col, sum

    if (vec.length !== this.length) {
      console.warn('MatrixModel.multVector: different input lengths: ' +
          this.length + '<>' + vec.length)
      return undefined
    }

    outVec.resize(vec.length)

    for (col = 0; col < outVec.length; col += 1) {
      sum = 0

      for (row = 0; row < outVec.length; row += 1) {
        sum += this.get(row, col) * vec.get(row)
      }

      outVec.set(col, sum)
    }

    return outVec
  }

  /**
   * set all elements in the matrix to the same value.
   *
   * In AntisymmetricMatrixModel, the superdiagonal elements will be inverted,
   * while the diagonal elements will equal the value.
   *
   * @param value
   *          Optional. The value. Defaults to 0.
   */
  MatrixModel.prototype.fill = function (value) {
    var row, col
    value = value || 0

    if (value === 0) {
      // discard all data, since get() defaults to 0.
      this.data.splice(0)
    } else {
      /*
       * Since we don't know about the data mapping, we cannot simply copy data
       * across this.data. Instead, we just iterate over this.set().
       */
      for (row = 0; row < this.length; row += 1) {
        for (col = 0; col < this.length; col += 1) {
          this.set(row, col, value)
        }
      }
    }
  }

  /**
   * prepare a readonly, nonreferencing, serializable data object, representing
   * the matrix
   *
   * @return a serializable data object
   */
  MatrixModel.prototype.save = function () {
    var data, mat

    data = MatrixModel.superclass.save.call(this)

    mat = this.data.map(function (row) {
      return row.map(function (cell) {
        return cell || 0
      })
    }, this)

    data.mat = RLE.encode(mat)
    data.len = this.length

    return data
  }

  MatrixModel.prototype.restore = function (data) {
    var mat
    if (!MatrixModel.superclass.restore.call(this, data)) {
      return false
    }

    this.resize(0)

    mat = RLE.decode(data.mat)

    mat.forEach(function (row, rowindex) {
      this.data[rowindex] = row.slice()
    }, this)

    this.resize(data.len)

    return true
  }

  MatrixModel.prototype.SAVEFORMAT = Object
    .create(MatrixModel.superclass.SAVEFORMAT)
  MatrixModel.prototype.SAVEFORMAT.mat = String
  MatrixModel.prototype.SAVEFORMAT.len = Number

  return MatrixModel
})
