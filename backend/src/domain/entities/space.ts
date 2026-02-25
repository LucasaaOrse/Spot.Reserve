interface SpaceProps {
  name: string;
  locationId: string;
  totalArea?: number | null;
}

interface UpdateSpaceProps {
  name?: string;
  locationId?: string;
  totalArea?: number | null;
}

export class Space {
  private props: SpaceProps;
  public readonly id: string;

  constructor(props: SpaceProps, id?: string) {
    this.props = {
      ...props,
      totalArea: props.totalArea ?? null,
    };

    this.id = id ?? crypto.randomUUID();
  }

  static create(props: SpaceProps, id?: string) {
    return new Space(props, id);
  }

  get name() {
    return this.props.name;
  }

  get locationId() {
    return this.props.locationId;
  }

  get totalArea() {
    return this.props.totalArea;
  }

  update(props: UpdateSpaceProps) {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }

    if (props.locationId !== undefined) {
      this.props.locationId = props.locationId;
    }

    if (props.totalArea !== undefined) {
      this.props.totalArea = props.totalArea;
    }
  }
}