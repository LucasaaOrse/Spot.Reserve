interface EventProps {
  title: string;
  description: string | null;
  date: Date;
  organizerId: string;
  locationId: string;
}

export class Event {
  private props: EventProps;
  public readonly id: string;

  constructor(props: EventProps, id?: string) {
    if (props.title.length < 5) {
      throw new Error("O título do evento deve ter pelo menos 5 caracteres.");
    }

    if (!id && props.date < new Date()) {
      throw new Error("O evento não pode ser agendado para uma data passada.");
    }

    this.props = {
      ...props,
      description: props.description ?? null,
    };

    this.id = id ?? crypto.randomUUID();
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get date() {
    return this.props.date;
  }

  get organizerId() {
    return this.props.organizerId;
  }

  get locationId() {
    return this.props.locationId;
  }

  public reschedule(newDate: Date) {
    if (newDate < new Date()) {
      throw new Error("A nova data deve ser no futuro.");
    }

    this.props.date = newDate;
  }

  public rename(newTitle: string) {
    if (newTitle.length < 5) {
      throw new Error("O título deve ter pelo menos 5 caracteres.");
    }

    this.props.title = newTitle;
  }

  public updateDescription(newDescription: string | null) {
    this.props.description = newDescription ?? null;
  }
  

}