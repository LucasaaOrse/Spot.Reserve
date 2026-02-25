// domain/entities/location.ts

export interface LocationProps {
  name: string;
  address: string;
  maxTables: number;
  maxSeatsPerTable: number;
}

export class Location {
  private props: LocationProps;
  private _id: string;

  constructor(props: LocationProps, id?: string) {
    if (props.name.length < 3) {
      throw new Error("Nome da localidade muito curto.");
    }

    if (props.maxTables <= 0) {
      throw new Error("A localidade deve permitir pelo menos 1 mesa.");
    }

    if (props.maxSeatsPerTable <= 0) {
      throw new Error("Cada mesa deve permitir pelo menos 1 cadeira.");
    }

    this.props = props;
    this._id = id ?? crypto.randomUUID();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get address() {
    return this.props.address;
  }

  get maxTables() {
    return this.props.maxTables;
  }

  get maxSeatsPerTable() {
    return this.props.maxSeatsPerTable;
  }

  public update(data: Partial<LocationProps>) {
    if (data.name && data.name.length < 3) {
      throw new Error("Nome da localidade muito curto.");
    }

    if (data.maxTables !== undefined && data.maxTables <= 0) {
      throw new Error("A localidade deve permitir pelo menos 1 mesa.");
    }

    if (
      data.maxSeatsPerTable !== undefined &&
      data.maxSeatsPerTable <= 0
    ) {
      throw new Error("Cada mesa deve permitir pelo menos 1 cadeira.");
    }

    this.props = {
      ...this.props,
      ...data,
    };
  }
}