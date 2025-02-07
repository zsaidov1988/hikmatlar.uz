import { Logger } from '@nestjs/common';
import { EntityRepository, Repository, getConnection } from 'typeorm';

import { Quote } from '../../entities/Quote';

@EntityRepository(Quote)
export class QuoteRepository extends Repository<Quote> {
  private readonly logger = new Logger(Quote.name);

  async findByRandomOrder(): Promise<Quote[]> {
    try {
      return await getConnection().query(
        `select 
          q.id,
          q."content",
          row_to_json(a.*) as author,
          q."views",
          q.cover_img,
          q.created_at,
          q.updated_at
        from quotes q
        left outer join authors a on q.author_id = a.id
        order by random() limit $1;`,
        [10]
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
