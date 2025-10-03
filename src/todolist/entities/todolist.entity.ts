/* eslint-disable prettier/prettier */
import { Base } from "src/user/entities/baseEntity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Todolist extends Base {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.todo)
  @JoinColumn({ name: 'UserId' }) // optional: keeps the column name as 'UserId'
  user: User;
}

export { User };
