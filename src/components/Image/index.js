import React from 'react'
import { Image } from 'react-native'

export default class Images extends React.Component {
  static defaultProps = {
    sources: [],
    onError: () => {},
  }

  state = { current: 0 }

  onError = (error) => {
    this.props.onError(error)
    const next = this.state.current + 1
    if (next < this.props.sources.length) {
      this.setState({ current: next })
    }
  }

  render() {
    const { onError, sources, ...rest } = this.props

    return (
      <Image
        source={sources[this.state.current]}
        onError={this.onError}
        {...rest}
      />
    )
  }
}