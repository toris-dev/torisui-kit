import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/table';

describe('Table', () => {
  it('renders a semantic table with header, body, footer, and caption', () => {
    render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead sort="ascending">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Acme</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole('table', { name: 'Invoices' });
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(screen.getByRole('cell', { name: 'Acme' })).toBeInTheDocument();
    // TableHead uses scope="col".
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
  });
});
