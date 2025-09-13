import { Column, Entity, } from "typeorm";
import { Base } from "./baseEntity";
import { role } from '../../enum/role.enum'

@Entity()
export class User extends Base {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: role,
    default: role.user,
  })
  role: role;
}
