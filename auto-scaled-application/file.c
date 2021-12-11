#include <stdlib.h>
#include<stdio.h>
#include<string.h>


typedef struct stack {
  int num;
  struct stack *prev;
}stack;

stack *top = NULL;

static size_t counter = 0;

void push(int num) {

  if(top == NULL) {
    top = (stack *)malloc(sizeof(stack));

    top->num = num;
    top->prev = NULL;
  }
  else {
    stack *node = (stack *)malloc(sizeof(stack));

    node->num = num;
    node->prev = top;

    top = node;
  }
  counter++;
}

int pop() {
   if(top == NULL) {
     return -1;
   } else {
     stack *node = top;
     int num = node->num;
     top = top->prev;
     free(node);
     return num;
   }
}

void display() {
  stack *node = top;

  while(node != NULL) {
    printf(" %d ", node->num);
    node = node->prev;
  }

  printf("\n");
}

int rem(int num) {
   if(top == NULL) {
     return -1;
   } else {
     stack *node = top;
     stack *prev = NULL;

     while(node != NULL) {
       if(node->num == num) {
         break;
       }
       prev = node;
       node = node->prev;
     }

     if(node == NULL) {
       return -1;
     }
     else {
      if(prev != NULL) {
        prev->prev = node->prev;
      } else {
          top = node->prev;
      }

      int num = node->num;
      free(node);
      counter--;
      return num;
     }
   }
}

int *array_diff(const int *arr1, size_t n1, const int *arr2, size_t n2, size_t *z) {

    //  <----  hajime!

  int *big_array, *small_array, i, j;
  size_t big_size, small_size;

  if(n1 > n2) {
    big_array = arr1;
    big_size = n1;
    small_array = arr2;
    small_size = n2;
  } else {

    big_array = arr2;
    big_size = n2;
    small_array = arr1;
    small_size = n1;
  }

  for(i=0;i<big_size;i++) {
    push(big_array[i]);
  }

  for(i=0;i<small_size;i++){
    rem(small_array[i]);
  }

  (*z) = counter;
  display();
  int *arr = (int *)malloc(sizeof(int) * counter);
  for(i=pop(), j=0; i!= -1; i=pop(),j++) {
    arr[j] = i;
  }
  return arr;
}

int main() {
    const int arr1[5] = {1, 2, 3, 4, 5};
    const int arr2[3] = {1, 3, 4};
    size_t i;

  size_t *z = (size_t*)malloc(sizeof(size_t));

  int *arr = array_diff(arr1, 5, arr2, 3, z);

  for(i=0; i<(*z); i++) {
    printf( " %d ", arr[i]);
  }

  printf("\n");

  return 0;
}
